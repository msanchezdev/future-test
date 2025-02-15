import { Command } from "commander";

export const cmdDbCheck = new Command("check")
  .description("Check database connection")
  .action(async () => {
    console.log("migrating database");
  });
