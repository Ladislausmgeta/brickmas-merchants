import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Business } from "./Business";

@Entity("products")
@Unique(["businessId", "name"]) // Ensures no duplicate product names per business
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  // Foreign key to Business
  @Column({ type: "uuid" })
  businessId!: string;

  @ManyToOne(() => Business, (business) => business.products, {
    onDelete: "CASCADE", // delete product if business is deleted
  })
  @JoinColumn({ name: "businessId" })
  business!: Business;

  // Product basic info
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "int", default: 0 })
  stock!: number;

  // Product status flags
  @Column({ type: "boolean", default: false })
  isPublished!: boolean;

  @Column({ type: "boolean", default: false })
  isSuspended!: boolean;

  // Timestamps
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
