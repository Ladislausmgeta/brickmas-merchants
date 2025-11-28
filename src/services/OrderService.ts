import { AppDataSource } from "../data-source";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Product } from "../entities/Product";

export class OrderService {
  private orderRepo = AppDataSource.getRepository(Order);
  private productRepo = AppDataSource.getRepository(Product);

  async createOrder(
    businessId: string,
    customerName: string,
    items: { productId: string; quantity: number }[]
  ) {
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const i of items) {
      const product = await this.productRepo.findOne({
        where: { id: i.productId, business: { id: businessId } },
      });
      if (!product) throw new Error(`Product not found: ${i.productId}`);

      const subtotal = Number(product.price) * i.quantity;

      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = i.quantity;
      orderItem.subtotal = subtotal;

      orderItems.push(orderItem);
      total += subtotal;
    }

    const order = new Order();
    order.business = { id: businessId } as any;
    order.customerName = customerName;
    order.status = "pending";
    order.total = total;
    order.items = orderItems;

    return await this.orderRepo.save(order);
  }

  async getOrders(businessId: string) {
    return await this.orderRepo.find({
      where: { business: { id: businessId } }, // 🔑 nested object
      relations: ["items", "items.product", "business"],
      order: { createdAt: "DESC" },
    });
  }

  async getSingle(id: string) {
    return await this.orderRepo.findOne({ where: { id } });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new Error("Order not found");
    order.status = status;
    return await this.orderRepo.save(order);
  }

  async delete(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new Error("Order not found");
    return await this.orderRepo.remove(order);
  }
}
