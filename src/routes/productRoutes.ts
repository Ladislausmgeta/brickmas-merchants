import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
const c = new ProductController();

r.use(requireAuth);

r.post("/", (req, res) => c.create(req, res));
r.put("/:id", (req, res) => c.update(req, res));
r.post("/:id/publish", (req, res) => c.publish(req, res));
r.post("/:id/unpublish", (req, res) => c.unpublish(req, res));
r.post("/:id/suspend", (req, res) => c.suspend(req, res));
r.delete("/:id", (req, res) => c.delete(req, res));
r.get("/:id", (req, res) => c.get(req, res));
r.get("/", (req, res) => c.list(req, res));

export default r;
