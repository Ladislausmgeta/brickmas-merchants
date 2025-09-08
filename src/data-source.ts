import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const dbType = process.env.DB_TYPE || "sqlite";

export const AppDataSource = new DataSource({
  type: dbType as any,
  database: process.env.DB_DATABASE || path.join(process.cwd(), "data", "database.sqlite"),
  synchronize: true, // for dev only. Use migrations in production.
  logging: false,
  entities: [path.join(__dirname, "entities", "*.ts")],
});
