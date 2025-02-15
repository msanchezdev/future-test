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
import { RecordId } from "~/schema/record-id";
import { t } from "elysia";

export const Entity = model({
  name: "Entity",
  table: "entity",
  properties: {
    id: RecordId(),
    name: t.String(),
    type: RecordId(),
    owner: RecordId(),
    attributes: t.Record(t.String(), t.Any()),
    timestamp: t.Object({
      created: t.Date(),
      updated: t.Date(),
      online: t.Union([t.Date(), t.Null()], { default: null }),
    }),
  },
});

export async function migrate(db: Surreal) {
  await db.query(/* surql */ `
    DEFINE TABLE OVERWRITE entity SCHEMAFULL COMMENT
      "Represents a device, or appliance owned by a client";

    DEFINE FIELD OVERWRITE name ON TABLE entity
      TYPE string;
    DEFINE FIELD OVERWRITE type ON TABLE entity
      TYPE record<entity_type>;
    DEFINE FIELD OVERWRITE owner ON TABLE entity
      TYPE record<client>;
    DEFINE FIELD OVERWRITE extra ON TABLE entity
      FLEXIBLE TYPE option<object>
      DEFAULT ALWAYS {}
      COMMENT "Supported device API shared by the device on registration";
    DEFINE FIELD OVERWRITE attributes ON TABLE entity
      FLEXIBLE TYPE option<object>
      // ASSERT fn::validate_attributes($value, $before.type)
      DEFAULT ALWAYS {};
    ;
    DEFINE FIELD OVERWRITE state ON TABLE entity
      FLEXIBLE TYPE option<object>
      // ASSERT fn::validate_state($value, $before.type)
      DEFAULT ALWAYS {};
    ;
    DEFINE FIELD OVERWRITE timestamp ON TABLE entity
      TYPE object
      DEFAULT ALWAYS {
        created: time::now(),
        updated: time::now(),
        online: null,
      };
    DEFINE FIELD OVERWRITE timestamp.created ON TABLE entity
      TYPE datetime
      VALUE $before OR time::now()
      DEFAULT time::now();
    DEFINE FIELD OVERWRITE timestamp.updated ON TABLE entity
      TYPE datetime
      VALUE time::now()
      DEFAULT time::now();
    DEFINE FIELD OVERWRITE timestamp.online ON TABLE entity
      TYPE datetime | null
      DEFAULT null DEFAULT time::now();
  `);
}

export async function seed(db: Surreal) {
  await db.query(/* surql */ `
    UPSERT entity:light1 CONTENT {
      name: "Living Room Light",
      type: entity_type:light,
      owner: client:client1,
      extra: {
        attributes: {
          brightness: {
            type: 'number',
            min: 0,
            max: 255,
          },
        }
      },
      attributes: {
        state: 'off',
        brightness: 128,
      },
    };

    UPSERT entity:light1 CONTENT {
      name: "Bedroom Light",
      type: entity_type:light,
      owner: client:client1,
      extra: {
        attributes: {
          brightness: {
            type: 'number',
            min: 0,
            max: 255,
          },
          color: {
            type: 'string',
            enum: ['red', 'green', 'blue'],
          },
        }
      },
      attributes: {
        state: 'off',
        brightness: 255,
        color: 'red'
      },
    };


    UPSERT entity:switch1 CONTENT {
      name: "Switch 1",
      type: entity_type:switch,
      owner: client:client1,
      attributes: {
        state: 'off'
      },
    };

    UPSERT entity:sunlight1 CONTENT {
      name: "Sunlight 1",
      type: entity_type:sensor,
      owner: client:client1,
      state: {
        intensity: 125,
      },
    };
  `);
}
