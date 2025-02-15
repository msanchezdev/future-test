import { treaty } from "@elysiajs/eden";
import { describe, expect, it } from "bun:test";
import { entitiesRoute } from "~/api/entities";

const http = treaty(entitiesRoute);

describe("/entities", () => {
  describe("GET /", () => {
    it("should return all entities", async () => {
      const { data, status } = await http.entities.index.get();

      expect(status).toBe(200);
      expect(data).toBeArray();
      expect(data!.some((e) => e.id === "entity:light1")).toBe(true);
    });
  });

  describe("GET /:id", () => {
    it("should return entity by id", async () => {
      const { data, status } = await http.entities({ id: "light1" }).get();

      expect(status).toBe(200);
      expect(data).toBeObject();
      expect(data!.id).toBe("entity:light1");
    });

    it("should return 404 if entity not found", async () => {
      const { error } = await http.entities({ id: "switch200" }).get();

      expect(error).toBeObject();
      expect(error!.status).toBe(404);
      // @ts-expect-error - TODO: fix type
      expect(error.message).toBe("Entity not found");
    });
  });

  describe("POST /", () => {
    it("should create a new entity", async () => {
      const { data } = await http.entities.index.post({
        id: "light2",
        name: "Light 2",
        type: "light",
        owner: "client1",
      });

      expect(data).toBeDefined();
      expect(data?.created?.id).toBe("entity:light2");
    });

    it("should fail if entity already exists", async () => {
      const { error } = await http.entities.index.post({
        id: "light1",
        name: "Light 1",
        type: "light",
        owner: "client1",
      });

      expect(error).toBeObject();
      expect(error!.status).toBe(409);
      // @ts-expect-error - TODO: fix type
      expect(error!.message).toBe("Entity already exists");
    });
  });

  describe("PUT /:id", () => {
    it("should update entity by id", async () => {
      const { data } = await http.entities({ id: "light1" }).put({
        name: "Best Light",
        type: "light",
        owner: "client1",
      });

      expect(data).toBeDefined();
      expect(data?.updated?.id).toBe("entity:light1");
      expect(data?.updated?.name).toBe("Best Light");
    });

    it("should fail if entity not found", async () => {
      const { error } = await http.entities({ id: "switch200" }).put({
        name: "Best Switch",
        type: "switch",
        owner: "client1",
      });

      expect(error).toBeObject();
      expect(error!.status).toBe(404);
      // @ts-expect-error - TODO: fix type
      expect(error!.message).toBe("Entity not found");
    });
  });

  describe("DELETE /:id", () => {
    it("should delete entity by id", async () => {
      const { data } = await http.entities({ id: "light1" }).delete();

      expect(data).toBeDefined();
      expect(data?.success).toBe(true);
    });
    it("should fail if entity not found", async () => {
      const { error } = await http.entities({ id: "switch200" }).delete();

      expect(error).toBeObject();
      expect(error!.status).toBe(404);
      // @ts-expect-error - TODO: fix type
      expect(error!.message).toBe("Entity not found");
    });
  });
});
