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

export const EntityType = model({
  name: "EntityType",
  table: "entity_type",
  properties: {
    name: t.String(),
    description: t.String(),
    timestamp: t.Object({
      created: t.Date(),
      updated: t.Date(),
      online: t.Tuple([t.Date(), t.Null()]),
    }),
  },
});

export async function migrate(db: Surreal) {
  await db.query(/* surql */ `
    DEFINE TABLE OVERWRITE entity_type SCHEMAFULL COMMENT
      "Entity types are used to categorize entities";

    DEFINE FIELD OVERWRITE name ON TABLE entity_type
      TYPE string;
    DEFINE FIELD OVERWRITE description ON TABLE entity_type
      TYPE string;
    DEFINE FIELD OVERWRITE base ON TABLE entity_type
      TYPE record<entity_type> | null
      DEFAULT ALWAYS null;

    // Attributes
    DEFINE FIELD OVERWRITE attributes ON TABLE entity_type
      TYPE object
      DEFAULT ALWAYS {}
      COMMENT "General user configurable attributes for this entity type. e.g. color, brightness";
    DEFINE FIELD OVERWRITE attributes[*] ON TABLE entity_type
      TYPE object;
    DEFINE FIELD OVERWRITE attributes[*].name ON TABLE entity_type
      TYPE string;
    DEFINE FIELD OVERWRITE attributes[*].description ON TABLE entity_type
      TYPE string;
    DEFINE FIELD OVERWRITE attributes[*].type ON TABLE entity_type
      TYPE 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'enum';
    DEFINE FIELD OVERWRITE attributes[*].order ON TABLE entity_type
      TYPE number;

    // Any Options
    DEFINE FIELD OVERWRITE attributes[*].default ON TABLE entity_type
      TYPE any;

    // Number Options
    DEFINE FIELD OVERWRITE attributes[*].min ON TABLE entity_type
      TYPE option<number>;
    DEFINE FIELD OVERWRITE attributes[*].max ON TABLE entity_type
      TYPE option<number>;

    // Timestamps
    DEFINE FIELD OVERWRITE timestamp ON TABLE entity_type
      TYPE object
      DEFAULT ALWAYS {
        created: time::now(),
        updated: time::now(),
        online: null,
      };
    DEFINE FIELD OVERWRITE timestamp.created ON TABLE entity_type
      TYPE datetime
      VALUE $before OR time::now()
      DEFAULT time::now();
    DEFINE FIELD OVERWRITE timestamp.updated ON TABLE entity_type
      TYPE datetime
      VALUE time::now()
      DEFAULT time::now();
    DEFINE FIELD OVERWRITE timestamp.online ON TABLE entity_type
      TYPE datetime | null
      DEFAULT ALWAYS null;
  `);
}

export async function seed(db: Surreal) {
  await db.query(/* surql */ `
    UPSERT entity_type:generic CONTENT {
      name: "Unknown",
      description: "An unknown device",
      attributes: {
        state: {
          name: "State",
          description: "The state of the light",
          type: "boolean",
          order: 0,
        },
      }
    };

    UPSERT entity_type:light CONTENT {
      name: "Light",
      description: "A light bulb",
      base: entity_type:generic,
      attributes: {},
    };

    UPSERT entity_type:switch CONTENT {
      name: "Switch",
      description: "A switch",
      base: entity_type:generic,
      attributes: {},
    };

    UPSERT entity_type:sensor CONTENT {
      name: "Sensor",
      description: "A sensor",
      base: entity_type:generic,
      attributes: {
        intensity: {
          name: "Intensity",
          description: "The intensity of the sensor",
          type: "number",
          order: 0,
        },
        unit_of_measurement: {
          name: "Unit of Measurement",
          description: "The unit of measurement of the sensor",
          type: "string",
          order: 1,
        },
      },
    };
  `);
}
