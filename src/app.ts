import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import businessRoutes from "./routes/businessRoutes";
import productRoutes from "./routes/productRoutes";

export const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || true }));
app.use(express.json({ limit: "200kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// routes
app.use("/api/businesses", businessRoutes);
app.use("/api/products", productRoutes);

// secure file download endpoint (requires auth middleware)
import { requireAuth } from "./middleware/auth";
import path from "path";
import fs from "fs";

app.get("/files/business/:filename", requireAuth, (req, res) => {
  const filename = String(req.params.filename);
  const base = path.join(process.cwd(), "uploads", "business", filename);
  if (!fs.existsSync(base)) return res.status(404).json({ error: "not_found" });
  // TODO: add permission check (ensure requesting user has access)
  return res.download(base);
});

// global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message || "internal_error" });
});
