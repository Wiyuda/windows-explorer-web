import "dotenv/config";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { nodeRoutes } from "./interface/routes/node.routes";
import { NodeService } from "./application/node.service";
import { NodeRepositoryImpl } from "./infrastructure/repositories/node.repository.impl";

const port = process.env.PORT || 3000;

// Dependency Injection
const nodeRepository = new NodeRepositoryImpl();
const nodeService = new NodeService(nodeRepository);

export const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: "Windows Explorer API",
        version: "1.0.0"
      }
    }
  }))
  .group("/api/v1", (app) => 
    app.use(nodeRoutes(nodeService))
  )
  .listen(port);

console.log(
  `🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📖 Documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger`
);