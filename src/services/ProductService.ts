import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product.js";

export class ProductService {
  private repo = AppDataSource.getRepository(Product);

  async createProduct(data: any) {
    // hakikisha businessId ipo
    if (!data.businessId) {
      throw new Error("businessId is required");
    }

    // 🔎 cheki kama kuna product yenye jina hilo ndani ya businessId hiyo
    const existingByName = await this.repo.findOne({
      where: { businessId: data.businessId, name: data.name },
    });

    if (existingByName) {
      throw new Error(
        `Product name '${data.name}' already exists for this business.`
      );
    }

    const ent = this.repo.create(data);
    return this.repo.save(ent);
  }

  async updateProduct(id: string, data: any) {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw Object.assign(new Error("not_found"), { status: 404 });
    console.log("Before update:", existing);
    console.log("Incoming:", data);
    const merged = this.repo.merge(existing, data);
    return this.repo.save(merged);
  }

  async publish(id: string) {
    const prod = await this.repo.findOneBy({ id });
    if (!prod) throw new Error("Not found");
    prod.isPublished = true;
    prod.isSuspended = false;
    return this.repo.save(prod); // <-- updatedAt will update
  }

  async unpublish(id: string) {
    const prod = await this.repo.findOneBy({ id });
    if (!prod) throw new Error("Not found");
    prod.isPublished = false;
    return this.repo.save(prod);
  }

  async suspend(id: string) {
    const prod = await this.repo.findOneBy({ id });
    if (!prod) throw new Error("Not found");
    prod.isSuspended = true;
    prod.isPublished = false;
    return this.repo.save(prod);
  }
  async delete(id: string) {
    await this.repo.delete(id);
  }

  async get(id: string) {
    return this.repo.findOneBy({ id });
  }
  async list(businessId?: string) {
    if (businessId) return this.repo.find({ where: { businessId } });
    return this.repo.find();
  }
}
