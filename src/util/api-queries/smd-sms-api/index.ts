import { makeApi, Zodios } from "@zodios/core";
import {
  generateOtpEndpoint,
  verifyOtpEndpoint,
  sendSmsEndpoint,
  sendEmailEndpoint,
} from "./endpoints";
import { createSafeClient, loggerPlugin } from "../plugins";

const smdApi = makeApi([
  generateOtpEndpoint,
  verifyOtpEndpoint,
  sendSmsEndpoint,
  sendEmailEndpoint,
]);
const client = new Zodios(process.env.SMD_SMS_API_URL! || "http://localhost:9427", smdApi);

client.use(loggerPlugin);

export const smdClient = createSafeClient(client, smdApi);