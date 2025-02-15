import Elysia, { error, NotFoundError, t } from "elysia";
import { Entity } from "~/database/models/entity";
import { EntityService } from "~/services/entity";
import { CreateEntityDto, UpdateEntityDto } from "~/services/entity.dto";

export const entitiesRoute = new Elysia({ prefix: "/entities" })
  .use(EntityService)
  .get(
    "/",
    async ({ entityService, logger }) => {
      logger.info("Listing all entities");
      return await entityService.findAll();
    },
    {
      detail: {
        description: "List all entities",
      },
    },
  )
  .get(
    "/:id",
    async ({ params: { id }, entityService, logger }) => {
      logger.info({ id }, "Fetching entity by id");
      const result = await entityService.findById(id);

      if (!result) {
        throw new NotFoundError("Entity not found");
      }

      return {
        ...result,
      };
    },
    {
      detail: {
        description: "Get entity by id",
      },
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: Entity.schema,
        404: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    },
  )
  .post(
    "/",
    async ({ logger, entityService, body }) => {
      logger.info({ body }, "Creating new entity");
      const existing = await entityService.findById(body.id);
      if (existing) {
        throw error(409, "Entity already exists");
      }

      const created = await entityService.create(body);
      return {
        success: true,
        created,
      };
    },
    {
      detail: {
        description: "Create a new entity",
      },
      body: CreateEntityDto,
      response: {
        200: t.Object({
          success: t.Boolean(),
          created: Entity.schema,
        }),
        422: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
        409: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    },
  )
  .put(
    "/:id",
    async ({ logger, params: { id }, body, entityService }) => {
      logger.info({ id, body }, "Updating entity by id");
      const existing = await entityService.findById(id);
      if (!existing) {
        throw new NotFoundError("Entity not found");
      }
      const updated = await entityService.updateById(id, body);
      return {
        success: true,
        updated,
      };
    },
    {
      detail: {
        description: "Update entity by id",
      },
      params: t.Object({
        id: t.String(),
      }),
      body: UpdateEntityDto,
      response: {
        200: t.Object({
          success: t.Boolean(),
          updated: Entity.schema,
        }),
        404: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    },
  )
  .delete(
    "/:id",
    async ({ params: { id }, entityService, logger }) => {
      logger.info({ id }, "Deleting entity by id");
      const existing = await entityService.findById(id);
      if (!existing) {
        throw new NotFoundError("Entity not found");
      }

      await entityService.deleteById(id);
      return {
        success: true,
      };
    },
    {
      detail: {
        description: "Delete entity by id",
      },
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
        }),
        404: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    },
  );
