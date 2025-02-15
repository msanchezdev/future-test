import Elysia from "elysia";
import { prepareDatabase } from "../database";

export const dbPlugin = new Elysia({ name: "Database" }).decorate(
  "db",
  await prepareDatabase(),
);
