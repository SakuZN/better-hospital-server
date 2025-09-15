import * as Fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { DOCUMENTATION, PORT } from "@/config/";
import swagger from "@fastify/swagger";
import registerRoutes from "@/routes";
import cron from "@/cron";
const serverOptions: Fastify.FastifyServerOptions = {
  logger: false,
  trustProxy: true,
};

//@ts-ignore
const app: Fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> =
  Fastify.fastify(serverOptions);

cron(app);
//@ts-ignore
app.get(
  "/",
  //@ts-ignore
  async (request: Fastify.FastifyRequest, reply: Fastify.FastifyReply) => {
    return reply.send({ message: "OK!" });
  },
);

if (DOCUMENTATION) {
  app
    .register(swagger, {
      openapi: {
        info: {
          title: "SMD Partner Proxy API Backend",
          description:
            "API Backend to handle all member data requests for Partner Integration",
          version: "1.0.0",
        },
        servers: [
          {
            url: `http://localhost:${PORT}`,
            description: "Local Development server",
          },
          {
            url: `https://partnerproxy.prodserver.smddoctors.com`,
            description: "Production server",
          },
          {
            url: `https://staging.smd-hmo-partner-api.smddoctors.com`,
            description: "Staging server",
          },
        ],
        components: {
          securitySchemes: {
            ApiKeyAuth: {
              type: "apiKey",
              in: "header",
              name: "apikey",
            },
          },
        },
      },
    })
    .then(() => {
      registerRoutes(app);
    });
} else {
  registerRoutes(app);
}

export default app;
