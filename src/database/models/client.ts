/**
 * I am currently building an ORM for the SurrealDB database.
 * This implementation is just something I made for this assessment project.
 *
 * SurrealDB is an amazing project that I would encourage you to check out.
 * It is a NoSQL database that is super fast and has a lot of features.
 * I am using it for my personal projects and I think it is a great fit for
 * this project.
 */
import type Surreal from "surrealdb";
import { model } from "../utils";
import { t } from "elysia";

export const Client = model({
  name: "Client",
  table: "client",
  properties: {
    name: t.String(),
    password: t.String(),
  },
});

export async function migrate(db: Surreal) {
  await db.query(/* surql */ `
    DEFINE TABLE OVERWRITE client SCHEMAFULL COMMENT
      "Represents a client of our platform";

    DEFINE FIELD OVERWRITE name ON TABLE client
      TYPE string;
    DEFINE FIELD OVERWRITE timestamp ON TABLE client
      TYPE object
      DEFAULT ALWAYS {};
    DEFINE FIELD OVERWRITE timestamp.created ON TABLE client
      TYPE option<datetime>
      VALUE $before OR time::now()
      DEFAULT time::now();
    DEFINE FIELD OVERWRITE timestamp.updated ON TABLE client
      TYPE option<datetime>
      VALUE time::now()
      DEFAULT time::now();
  `);
}

export async function seed(db: Surreal) {
  await db.query(/* surql */ `
    UPSERT client:client1 CONTENT {
      name: "First Test Client",
    };

    UPSERT client:client2 CONTENT {
      name: "Second Test Client",
    };

    UPSERT client:client3 CONTENT {
      name: "Third Test Client",
    };
  `);
}
