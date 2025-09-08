import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";

export interface AuthRequest extends Request {
  userId?: string;
  token?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "missing_token" });
  try {
    const payload = jwt.verify(token, SECRET) as any;
    req.userId = payload.sub || payload.userId || payload.id;
    req.token = token;
    next();
  } catch (e) {
    return res.status(401).json({ error: "invalid_token" });
  }
}
