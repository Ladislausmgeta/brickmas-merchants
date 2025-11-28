import { Request, Response } from "express";
import { BusinessService } from "../services/BusinessService.js";

const svc = new BusinessService();

export class BusinessController {
  async create(req: Request, res: Response) {
    try {
      const saved = await svc.createBusiness(req.body, (req as any).files);
      return res.status(201).json(saved);
    } catch (err: any) {
      console.error("create error:", err);
      return res
        .status(err.status || 400)
        .json({ error: err.message || "create_failed" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updated = await svc.updateBusiness(
        req.params.id,
        req.body,
        (req as any).files
      );
      return res.json(updated);
    } catch (err: any) {
      console.error("update error:", err);
      if (err.message === "not_found")
        return res.status(404).json({ error: "not_found" });
      return res
        .status(err.status || 400)
        .json({ error: err.message || "update_failed" });
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
    const b = await svc.get(req.params.id);
    if (!b) return res.status(404).json({ error: "not_found" });
    res.json(b);
  }
  async list(req: Request, res: Response) {
    const filter: any = {};
    if (req.query.published !== undefined)
      filter.published = req.query.published === "true";
    if (req.query.suspended !== undefined)
      filter.suspended = req.query.suspended === "true";
    const list = await svc.list(filter);
    res.json(list);
  }
}
