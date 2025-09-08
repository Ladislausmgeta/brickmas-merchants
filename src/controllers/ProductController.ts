import { Request, Response } from "express";
import { ProductService } from "../services/ProductService.js";

const svc = new ProductService();

export class ProductController {
  async create(req: Request, res: Response) {
    try {
      const p = await svc.createProduct(req.body);
      res.status(201).json(p);
    } catch (err: any) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const p = await svc.updateProduct(req.params.id, req.body);
      res.json(p);
    } catch (err: any) {
      console.error(err);
      res.status(err.status || 400).json({ error: err.message });
    }
  }

  async publish(req: Request, res: Response) {
    await svc.publish(req.params.id);
    res.json({ ok: true });
  }
  async unpublish(req: Request, res: Response) {
    await svc.unpublish(req.params.id);
    res.json({ ok: true });
  }
  async suspend(req: Request, res: Response) {
    await svc.suspend(req.params.id);
    res.json({ ok: true });
  }
  async delete(req: Request, res: Response) {
    await svc.delete(req.params.id);
    res.status(204).send();
  }
  async get(req: Request, res: Response) {
    const p = await svc.get(req.params.id);
    if (!p) return res.status(404).json({ error: "not_found" });
    res.json(p);
  }
  async list(req: Request, res: Response) {
    const businessId = req.query.businessId as string | undefined;
    const list = await svc.list(businessId);
    res.json(list);
  }
}
