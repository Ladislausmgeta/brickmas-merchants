import { Router } from "express";
import { BusinessController } from "../controllers/BusinessController.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const c = new BusinessController();
const r = Router();

r.use(requireAuth);

r.post(
  "/createBusiness",
  upload.fields([
    { name: "brellaCertificate", maxCount: 1 },
    { name: "businessLicense", maxCount: 1 },
    { name: "ownerNidaIdDoc", maxCount: 1 },
  ]),
  (req, res) => c.create(req, res)
);

r.put(
  "/updateBusiness/:id",
  upload.fields([
    { name: "brellaCertificate", maxCount: 1 },
    { name: "businessLicense", maxCount: 1 },
    { name: "ownerNidaIdDoc", maxCount: 1 },
  ]),
  (req, res) => c.update(req, res)
);

// actions
r.post("/publish/:id", (req, res) => c.publish(req, res));
r.post("/unpublish/:id", (req, res) => c.unpublish(req, res));
r.post("/suspend/:id", (req, res) => c.suspend(req, res));

// CRUD
r.delete("/delete/:id", (req, res) => c.delete(req, res));
r.get("/:id", (req, res) => c.get(req, res));
r.get("/", (req, res) => c.list(req, res));

export default r;
