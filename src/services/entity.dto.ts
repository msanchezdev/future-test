import { t } from "elysia";

export const CreateEntityDto = t.Object({
  id: t.String(),
  name: t.String({ error: "Name is required" }),
  type: t.String({ error: "Type is required" }),
  owner: t.String({ error: "Owner is required" }),
  attributes: t.Optional(
    t.Record(t.String(), t.Any(), {
      error: "Attributes are required",
    }),
  ),
});

export const UpdateEntityDto = t.Object({
  name: t.Optional(t.String({ error: "Name must be a string" })),
  type: t.Optional(t.String({ error: "Type must be a string" })),
  owner: t.Optional(t.String({ error: "Owner must be a string" })),
  attributes: t.Optional(
    t.Record(t.String(), t.Any(), {
      error: "Attributes must be an object",
    }),
  ),
});
