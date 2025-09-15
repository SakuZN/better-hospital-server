import fastifyCron from "fastify-cron";
import { FastifyInstance } from "fastify";
import { runHospitalAnalyticsCron } from "./analytics-cron";

export default (app: FastifyInstance) => {
  app.register(fastifyCron, {
    jobs: [
      {
        timeZone: "Asia/Manila",
        cronTime: "0 0 * * *",
        onTick: () => runHospitalAnalyticsCron(),
        startWhenReady: true,
        runOnInit: true,
      },
    ],
  });
};
