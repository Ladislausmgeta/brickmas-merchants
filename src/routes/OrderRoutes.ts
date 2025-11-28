import { Router } from "express";
import {
  createOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/OrderController";

const router = Router();

router.post("/", createOrder);
router.get("/:businessId", getOrders);
router.get("/single/:id", getSingleOrder);
router.patch("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
