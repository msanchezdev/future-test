import { Command } from "commander";
import { Glob } from "bun";
import ora from "ora";
import { relative, resolve } from "node:path";
import chalk from "chalk";
import { prepareDatabase } from "~/database";
import type Surreal from "surrealdb";

export const cmdDbMigrate = new Command("migrate")
  .description("Migrate the database")
  .action(async () => {
    const db = await prepareDatabase(false);
    await migrate(db);
    await db.close();
  });

/**
 * Migrate the database
 *
 * Use this function instead of runnig the command if using a memory database
 */
export async function migrate(db: Surreal) {
  const modelsFolder = "src/database/models";
  const models = new Glob(`${modelsFolder}/*.ts`);
  console.log("Models:");

  for await (const modelFile of models.scan()) {
    const spinner = ora(` ${relative(modelsFolder, modelFile)}`).start();
    try {
      const module = await import(resolve(".", modelFile));
      if (!module.migrate) {
        spinner.warn(
          ` ${relative(modelsFolder, modelFile)} ${chalk.dim(`(No migrate function)`)}`,
        );
        continue;
      }

      await module.migrate(db);
      spinner.succeed();
    } catch (err) {
      spinner.fail();
      throw err;
    }
  }

  console.log("Functions:");
  const functionsFolder = "src/database/functions";
  const functions = new Glob(`${functionsFolder}/*.ts`);

  for await (const functionFile of functions.scan()) {
    const spinner = ora(` ${relative(functionsFolder, functionFile)}`).start();
    try {
      const module = await import(resolve(".", functionFile));
      if (!module.define) {
        spinner.warn(
          ` ${relative(functionsFolder, functionFile)} ${chalk.dim(`(No define function)`)}`,
        );
        continue;
      }

      await module.define(db);
      spinner.succeed();
    } catch (err) {
      spinner.fail();
      throw err;
    }
  }
}
