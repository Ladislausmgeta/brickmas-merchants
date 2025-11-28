import { Request, Response } from "express";
import { OrderService } from "../services/OrderService";

const service = new OrderService();

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { businessId, customerName, items } = req.body;
    const data = await service.createOrder(businessId, customerName, items);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const data = await service.getOrders(businessId);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await service.getSingle(id);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await service.updateStatus(id, status);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await service.delete(id);
    res.json({ message: "Deleted", data });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
