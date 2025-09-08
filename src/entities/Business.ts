import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("businesses")
export class Business {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 20 })
  phone1!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  phone2?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  tin?: string;

  // stored relative path e.g. uploads/business/1234-abc.pdf
  @Column({ type: "varchar", length: 512, nullable: true })
  brellaCertificate?: string;

  @Column({ type: "varchar", length: 512, nullable: true })
  businessLicense?: string;

  @Column({ type: "varchar", length: 512, nullable: true })
  ownerNidaIdDoc?: string;

  @Column({ type: "varchar", length: 255 })
  ownerName!: string;

  @Column({ type: "varchar", length: 50 })
  ownerNidaId!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  location?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  supportContact?: string;

  @Column({ type: "boolean", default: false })
  isPublished!: boolean;

  @Column({ type: "boolean", default: false })
  isSuspended!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
