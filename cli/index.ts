import { version } from "../package.json";
import { Command } from "commander";
import { cmdDb } from "./db/_index";

const program = new Command("future-test").version(version).addCommand(cmdDb);

await program.parseAsync();
