import { Command } from "commander";
import { cmdDbMigrate } from "./migrate";
import { cmdDbCheck } from "./check";
import { cmdDbSeed } from "./seed";

export const cmdDb = new Command("db")
  .description("Manage the database")
  .addCommand(cmdDbMigrate)
  .addCommand(cmdDbCheck)
  .addCommand(cmdDbSeed);
