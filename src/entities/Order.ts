import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Business } from "./Business";
import { OrderItem } from "./OrderItem";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: "businessId" })
  business!: Business;

  @Column({ type: "varchar", length: 100 })
  customerName!: string;

  @Column({ type: "varchar", length: 20 })
  status!: string; // pending, paid, cancelled

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];
}
