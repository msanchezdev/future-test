import Elysia from "elysia";
import type { StaticDecode } from "@sinclair/typebox";
import { RecordId, StringRecordId, surrealql } from "surrealdb";
import { Entity } from "~/database/models/entity";
import { dbPlugin } from "~/plugins/db";
import { loggerPlugin } from "~/plugins/logger";
import type { CreateEntityDto, UpdateEntityDto } from "./entity.dto";

export const EntityService = new Elysia({ name: "Service.Entity" })
  .use(loggerPlugin)
  .use(dbPlugin)
  .derive({ as: "scoped" }, ({ db, logger }) => ({
    entityService: {
      findAll: async () => {
        const [result] = await db.query<
          InstanceType<typeof Entity>[][]
        >(/* surql */ `
          SELECT * FROM entity;
        `);

        logger.info({ result }, "Fetched all entities");
        return result.map((data) => new Entity(data));
      },
      findById: async (id: string) => {
        const [result] = await db.query<
          InstanceType<typeof Entity>[][]
        >(/* surql */ surrealql`
          SELECT * FROM ${new StringRecordId(new RecordId("entity", id))}
        `);

        logger.info({ result }, "Fetched entity by id");
        return result.map((data) => new Entity(data))[0] || null;
      },
      create: async (data: StaticDecode<typeof CreateEntityDto>) => {
        const [result] = await db.query<
          InstanceType<typeof Entity>[][]
        >(/* surql */ surrealql`
          CREATE entity CONTENT ${{
            ...data,
            type: new StringRecordId(new RecordId("entity_type", data.type)),
            owner: new StringRecordId(new RecordId("client", data.owner)),
            attributes: data.attributes ?? {},
          }}
        `);

        logger.info({ result }, "Created new entity");
        return result.map((data) => new Entity(data))[0] || null;
      },
      updateById: async (
        id: string,
        data: StaticDecode<typeof UpdateEntityDto>,
      ) => {
        if (data.type) {
          // @ts-expect-error - TODO: fix type
          data.type = new StringRecordId(
            new RecordId("entity_type", data.type),
          );
        }
        if (data.owner) {
          // @ts-expect-error - TODO: fix type
          data.owner = new StringRecordId(new RecordId("client", data.owner));
        }

        const [result] = await db.query<
          InstanceType<typeof Entity>[][]
        >(/* surql */ surrealql`
          UPDATE ${new StringRecordId(new RecordId("entity", id))}
          MERGE ${data}
        `);

        logger.info({ result }, "Updated entity by id");
        return result.map((data) => new Entity(data))[0] || null;
      },
      deleteById: async (id: string) => {
        const [result] = await db.query<
          InstanceType<typeof Entity>[][]
        >(/* surql */ `
          DELETE ${new StringRecordId(new RecordId("entity", id))}
        `);

        logger.info({ result }, "Deleted entity by id");
        return result.map((data) => new Entity(data))[0] || null;
      },
    },
  }));
