import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { Business } from "../entities/Business";

export class ProductService {
  private repo = AppDataSource.getRepository(Product);
  private bizRepo = AppDataSource.getRepository(Business);

  async createProduct(data: any) {
    if (!data.businessId) {
      throw new Error("businessId is required");
    }

    // make sure business exists
    const biz = await this.bizRepo.findOneBy({ id: data.businessId });
    if (!biz) {
      throw new Error("Business not found");
    }

    // check unique name inside this business
    const existingByName = await this.repo.findOne({
      where: {
        businessId: data.businessId,
        name: data.name,
      },
    });

    if (existingByName) {
      throw new Error(
        `Product name '${data.name}' already exists for this business.`
      );
    }

    const ent = this.repo.create({
      ...data,
      businessId: biz.id, // attach Business id
    });

    return this.repo.save(ent);
  }

  async updateProduct(id: string, data: any) {
    const existing = await this.repo.findOne({
      where: { id },
      relations: ["business"],
    });

    if (!existing) {
      throw Object.assign(new Error("not_found"), { status: 404 });
    }

    // If businessId changed
    if (data.businessId) {
      const biz = await this.bizRepo.findOneBy({ id: data.businessId });
      if (!biz) throw new Error("Business not found");
      existing.businessId = biz.id;
    }

    const merged = this.repo.merge(existing, data);

    return this.repo.save(merged);
  }

  async publish(id: string) {
    const prod = await this.repo.findOneBy({ id });
    if (!prod) throw new Error("Not found");

    prod.isPublished = true;
    prod.isSuspended = false;
    return this.repo.save(prod);
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
    return this.repo.findOne({
      where: { id },
      relations: ["businessId"],
    });
  }

  async list(businessId?: string) {
    if (businessId) {
      return this.repo.find({
        where: { businessId: businessId },
        relations: ["businessId"],
      });
    }
    return this.repo.find({ relations: ["businessId"] });
  }
}
