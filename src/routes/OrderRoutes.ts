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
router.get("/getorders/:businessId", getOrders);
router.get("/single/:id", getSingleOrder);
router.patch("/update/:id", updateOrderStatus);
router.delete("/delete/:id", deleteOrder);

export default router;
