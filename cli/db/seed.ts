import { Command } from "commander";
import { Glob } from "bun";
import ora from "ora";
import { relative, resolve } from "node:path";
import { prepareDatabase } from "~/database";
import type Surreal from "surrealdb";

const modelsFolder = "src/database/models";

export const cmdDbSeed = new Command("seed")
  .description("Seed the database")
  .action(async () => {
    const db = await prepareDatabase(false);
    await seed(db);
    await db.close();
  });

/**
 * Seed the database
 *
 * Use this function instead of runnig the command if using a memory database
 */
export async function seed(db: Surreal) {
  const models = new Glob(`${modelsFolder}/*.ts`);
  console.log("Seeding data for models in src/models");

  let seeded = 0;
  for await (const modelFile of models.scan()) {
    const spinner = ora(` ${relative(modelsFolder, modelFile)}`).start();
    try {
      const module = await import(resolve(".", modelFile));
      if (!module.seed) {
        spinner.stop();
        continue;
      }

      await module.seed(db);
      seeded++;
      spinner.succeed();
    } catch (err) {
      spinner.fail();
      throw err;
    }
  }

  if (seeded === 0) {
    console.log("No model file found exporting a seed function");
  }
}
