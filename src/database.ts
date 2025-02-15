import Surreal from "surrealdb";
import { surrealdbWasmEngines } from "@surrealdb/wasm";
import { config } from "./config";

export const prepareDatabase = async (migrateInMemory = true) => {
  const db = new Surreal({ engines: surrealdbWasmEngines() });
  await db.connect(config.database.url, {
    namespace: config.database.namespace,
    database: config.database.name,
    auth: config.database.isMemory
      ? undefined
      : {
          username: config.database.user,
          password: config.database.pass,
        },
  });

  if (config.database.isMemory && migrateInMemory) {
    console.log("Using in-memory database. Running migrations and seeding...");
    const { seed } = await import("../cli/db/seed");
    const { migrate } = await import("../cli/db/migrate");
    await migrate(db);
    await seed(db);
  }

  return db;
};
