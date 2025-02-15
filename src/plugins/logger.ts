import Elysia from "elysia";
import pino from "pino";
import { config } from "~/config";

export const loggerPlugin = new Elysia().decorate(
  "logger",
  pino({
    level: config.environment.isTest
      ? "silent"
      : config.environment.isDevelopment
        ? "debug"
        : "info",
    transport: config.environment.isDevelopment
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
  }),
);
