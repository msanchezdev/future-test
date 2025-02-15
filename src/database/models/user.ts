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

export const User = model({
  name: "User",
  table: "user",
  properties: {
    name: t.String(),
    password: t.String(),
    timestamp: t.Object({
      created: t.Date(),
      updated: t.Date(),
    }),
  },
});

export async function migrate(db: Surreal) {
  await db.query(/* surql */ `
    DEFINE TABLE OVERWRITE user SCHEMAFULL COMMENT
      "Represents a user in the system which can log in and perform actions";

    DEFINE FIELD OVERWRITE name ON TABLE user TYPE string;
    DEFINE FIELD OVERWRITE username ON TABLE user TYPE string;
    DEFINE FIELD OVERWRITE email ON TABLE user TYPE string;
    DEFINE FIELD OVERWRITE account ON TABLE user TYPE record<client> | null;
    DEFINE FIELD OVERWRITE password ON TABLE user TYPE string
        VALUE
            (!!$input AND crypto::argon2::generate($input))
            OR $before
        PERMISSIONS FOR SELECT NONE;
    DEFINE FIELD OVERWRITE timestamp ON TABLE user TYPE object DEFAULT ALWAYS {};
    DEFINE FIELD OVERWRITE timestamp.created ON TABLE user TYPE option<datetime> VALUE $before OR time::now() DEFAULT time::now();
    DEFINE FIELD OVERWRITE timestamp.updated ON TABLE user TYPE option<datetime> VALUE time::now() DEFAULT time::now();
  `);
}

export async function seed(db: Surreal) {
  await db.query(/* surql */ `
    UPSERT user:admin CONTENT {
      name: "Administrator",
      username: "admin",
      password: "admin",
      email: "manuel+admin@msanchez.dev",
      account: null,
    };

    UPSERT user:client1 CONTENT {
      name: "First Test Client",
      username: "client1",
      password: "welc0me",
      email: "manuel+client1@msanchez.dev",
      account: client:client1,
    };
  `);
}
