import { Elysia } from "elysia";
import { api } from "./api/_index";
import { config } from "./config";
import swagger from "@elysiajs/swagger";

// prettier-ignore
const app = new Elysia()
  .use(swagger())
  .use(api)
  .listen({
    hostname: config.http.host,
    port: config.http.port,
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
