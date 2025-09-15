import app from "@/app";
import cors from "@fastify/cors";
import {DOCUMENTATION, DOCUMENTATION_NAME, PORT} from "@/config/";
import { writeFileSync } from "fs";
import logger from "@/util/local-logger";
import pocketbaseClient from "@/util/pocketbase";
if (!DOCUMENTATION) {
  app.register(cors, {
    origin: ["*"],
    methods: ["GET", "PUT", "POST", "OPTIONS", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  });
}

app.listen({ port: PORT, host: "0.0.0.0" }, async (err) => {
  if (err) {
    app.log.error(err);
    console.error(`Error starting server: ${err}`);
    process.exit(1);
  }
  console.info(`Server listening on port ${PORT}`);
});
if (DOCUMENTATION) {
  app.ready().then(() => {
    //@ts-ignore
    const fileName = `${DOCUMENTATION_NAME}.yaml`;
    const yaml = app.swagger({ yaml: true });
    writeFileSync(`./${fileName}`, yaml);
    logger.info(`Swagger documentation written to ${fileName}`);
  });
}

app.ready().then(() => {
  //@ts-ignore
  pocketbaseClient();
});
