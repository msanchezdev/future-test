import { get } from "env-var";
import "dotenv/config";
const environment = get("NODE_ENV").default("development").asString();
console.log("environment", environment);
const databaseUrl = get("DATABASE_URL").default("mem://").asUrlString();

export const config = {
  environment: {
    name: environment,
    isDevelopment: environment === "development",
    isProduction: environment === "production",
    isTest: environment === "test",
  },
  http: {
    host: get("HTTP_HOST").default("0.0.0.0").asString(),
    port: get("HTTP_PORT").default(3000).asPortNumber(),
  },
  database: {
    url: databaseUrl,
    namespace: get("DATABASE_NAMESPACE").default("future").asString(),
    name: get("DATABASE_NAME").default("future").asString(),
    user: get("DATABASE_USER").default("root").asString(),
    pass: get("DATABASE_PASS").default("root").asString(),
    isMemory: databaseUrl === "mem://",
  },
};
