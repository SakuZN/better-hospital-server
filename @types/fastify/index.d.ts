import fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { LogData } from "@/util/pocketbase";
declare module "fastify" {
  export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse,
  > {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
      done: (err?: Error) => void,
    ) => void;
  }
  export interface FastifyRequest {
    logData: LogData;
  }
}
