import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product.js";

export class ProductService {
  private repo = AppDataSource.getRepository(Product);

  async createProduct(data: any) {
    const ent = this.repo.create(data);
    return this.repo.save(ent);
  }

  async updateProduct(id: string, data: any) {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw Object.assign(new Error("not_found"), { status: 404 });
    Object.assign(existing, data);
    return this.repo.save(existing);
  }

  async publish(id: string) { await this.repo.update(id, { isPublished: true }); }
  async unpublish(id: string) { await this.repo.update(id, { isPublished: false }); }
  async suspend(id: string) { await this.repo.update(id, { isSuspended: true }); }
  async delete(id: string) { await this.repo.delete(id); }

  async get(id: string) { return this.repo.findOneBy({ id }); }
  async list(businessId?: string) {
    if (businessId) return this.repo.find({ where: { businessId } });
    return this.repo.find();
  }
}
