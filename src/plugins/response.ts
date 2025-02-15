import Elysia, { error } from "elysia";
import { loggerPlugin } from "./logger";

export const responsePlugin = new Elysia({ name: "Plugin.Response" })
  .use(loggerPlugin)
  .onError({ as: "global" }, ({ logger, code, error: err, set }) => {
    logger.error({ error: err }, "An error has occured: ");
    set.headers["content-type"] = "application/json";
    if (code === "VALIDATION") {
      return error(set.status || 422, {
        success: false,
        message: err.message,
      });
    }

    // @ts-expect-error - TODO: fix type
    return error(err?.code || set.status || 500, {
      success: false,
      message: "Internal server error",
      error: err,
    });
  });
