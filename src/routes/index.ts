import {FastifyInstance, RouteOptions} from "fastify";
import path from "path";
import fs from "fs";
import {DOCUMENTATION_NAME} from "@/config";

const documentationRoute: RouteOptions = {
  method: "GET",
  url: "/api/documentation",
  handler: async (_, reply) => {
    const filePath = path.resolve(process.cwd(), `./${DOCUMENTATION_NAME}.yaml`);
    const yaml = await fs.promises.readFile(filePath, "utf8");
    reply.header("content-type", "application/x-yaml").send(yaml);
  },
};
export default function registerRoutes(app: FastifyInstance) {
  const routes = [documentationRoute];

  routes.forEach((route) => {
    //@ts-ignore
    app.route(route);
  });
}
