import Elysia from "elysia";
import { responsePlugin } from "~/plugins/response";
import { entitiesRoute } from "./entities";

export const api = new Elysia({ prefix: "/api" })
  .use(responsePlugin)
  .use(entitiesRoute);
