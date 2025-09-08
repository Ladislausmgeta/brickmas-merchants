import fs from "fs";
import path from "path";
import { AppDataSource } from "../data-source";
import { Business } from "../entities/Business";
import { scanFile } from "../utils/virusScan";

const PERM_DIR = path.join(process.cwd(), "uploads", "business");
if (!fs.existsSync(PERM_DIR)) fs.mkdirSync(PERM_DIR, { recursive: true });

export class BusinessService {
  private repo = AppDataSource.getRepository(Business);

  private async moveToPermanent(tmpPath: string) {
    const base = path.basename(tmpPath);
    const dest = path.join(PERM_DIR, base);
    fs.renameSync(tmpPath, dest);
    // return path relative to project root (for easy download)
    return path.join("uploads", "business", base).replace(/\\/g, "/");
  }

  async createBusiness(data: any, files: any) {
    // scan all uploaded files in tmp
    if (files) {
      const fileList = Object.values(files).flat();
      for (const f of fileList) await scanFile((f as { path: string }).path);
    }

    const payload: any = { ...data };

    if (files?.brellaCertificate) payload.brellaCertificate = await this.moveToPermanent(files.brellaCertificate[0].path);
    if (files?.businessLicense) payload.businessLicense = await this.moveToPermanent(files.businessLicense[0].path);
    if (files?.ownerNidaIdDoc) payload.ownerNidaIdDoc = await this.moveToPermanent(files.ownerNidaIdDoc[0].path);

    const ent = this.repo.create(payload);
    return this.repo.save(ent);
  }

  async updateBusiness(id: string, data: any, files: any) {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw Object.assign(new Error("not_found"), { status: 404 });
    // scan files
    if (files) {
      const fileList = Object.values(files).flat();
      for (const f of fileList) await scanFile((f as { path: string }).path);
    }

    if (files?.brellaCertificate) existing.brellaCertificate = await this.moveToPermanent(files.brellaCertificate[0].path);
    if (files?.businessLicense) existing.businessLicense = await this.moveToPermanent(files.businessLicense[0].path);
    if (files?.ownerNidaIdDoc) existing.ownerNidaIdDoc = await this.moveToPermanent(files.ownerNidaIdDoc[0].path);

    // update only provided fields (optional)
    const allowed = [
      "name", "phone1", "phone2", "email", "tin", "ownerName", "ownerNidaId", "location", "supportContact"
    ];
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        // @ts-ignore
        existing[k] = data[k];
      }
    }

    return this.repo.save(existing);
  }

  async publish(id: string) { await this.repo.update(id, { isPublished: true }); }
  async unpublish(id: string) { await this.repo.update(id, { isPublished: false }); }
  async suspend(id: string) { await this.repo.update(id, { isSuspended: true }); }
  async delete(id: string) { await this.repo.delete(id); }

  // list/get
  async get(id: string) { return this.repo.findOneBy({ id }); }
  async list(filter?: { published?: boolean; suspended?: boolean }) {
    const qb = this.repo.createQueryBuilder("b");
    if (filter?.published !== undefined) qb.andWhere("b.isPublished = :p", { p: filter.published });
    if (filter?.suspended !== undefined) qb.andWhere("b.isSuspended = :s", { s: filter.suspended });
    return qb.getMany();
  }
}
