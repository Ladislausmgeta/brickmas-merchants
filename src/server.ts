import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./data-source";
import { app } from "./app";

const port = Number(process.env.PORT || 3001);

async function main() {
  await AppDataSource.initialize();
  console.log("DB initialized");
  app.listen(port, () => console.log(`Business API listening on :${port}`));
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
