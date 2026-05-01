import { Elysia, t } from "elysia";
import { NodeService } from "../../application/node.service";
import { sendSuccess, sendError } from "../../utils/response.helper";

export const nodeRoutes = (nodeService: NodeService) => 
  new Elysia({ prefix: "/nodes" })
    .get("/tree", async ({ set }) => {
      try {
        const result = await nodeService.getTree();
        return sendSuccess(result);
      } catch (err: any) {
        return sendError(set, err.message);
      }
    })
    .get("/search", async ({ query: { q }, set }) => {
      try {
        const result = await nodeService.search(q || "");
        return sendSuccess(result);
      } catch (err: any) {
        return sendError(set, err.message);
      }
    }, {
      query: t.Object({
        q: t.Optional(t.String())
      })
    })
    .get("/:id/children", async ({ params: { id }, set }) => {
      try {
        const result = await nodeService.getChildren(id);
        return sendSuccess(result);
      } catch (err: any) {
        const status = err.message === "Invalid ID format" ? 400 : 500;
        return sendError(set, err.message, status);
      }
    }, {
      params: t.Object({
        id: t.String()
      })
    });
