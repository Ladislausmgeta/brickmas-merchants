import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "./data-source";
import { app } from "./app";

const port = Number(process.env.PORT || 3001);

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Failed to initialize database:", err);
    process.exit(1); // stop server completely
  }

  app.listen(port, () => {
    console.log(`🚀 API listening on port ${port}`);
  });
}

main();
