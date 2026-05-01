import { Elysia, t } from "elysia";
import { NodeService } from "../../application/node.service";

export const nodeRoutes = (nodeService: NodeService) => 
  new Elysia({ prefix: "/nodes" })
    .get("/tree", async ({ set }) => {
      try {
        const result = await nodeService.getTree();
        return { success: true, data: result, message: "OK" };
      } catch (err: any) {
        set.status = 500;
        return { success: false, data: null, message: err.message };
      }
    })
    .get("/search", async ({ query: { q }, set }) => {
      try {
        const result = await nodeService.search(q || "");
        return { success: true, data: result, message: "OK" };
      } catch (err: any) {
        set.status = 500;
        return { success: false, data: null, message: err.message };
      }
    }, {
      query: t.Object({
        q: t.Optional(t.String())
      })
    })
    .get("/:id/children", async ({ params: { id }, set }) => {
      try {
        const result = await nodeService.getChildren(id);
        return { success: true, data: result, message: "OK" };
      } catch (err: any) {
        set.status = err.message === "Invalid ID format" ? 400 : 500;
        return { success: false, data: null, message: err.message };
      }
    }, {
      params: t.Object({
        id: t.String()
      })
    });
