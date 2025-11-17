import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("products")
@Unique(["businessId", "name"])
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  businessId!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "int", default: 0 })
  stock!: number;

  @Column({ type: "boolean", default: false })
  isPublished!: boolean;

  @Column({ type: "boolean", default: false })
  isSuspended!: boolean;

  @CreateDateColumn({ type: "timestamp", precision: 6 })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", precision: 6 })
  updatedAt!: Date;
}
