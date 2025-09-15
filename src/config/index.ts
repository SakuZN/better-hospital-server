import dotenv from "dotenv";
import * as process from "node:process";
dotenv.config({
  path: ".env",
});

const ENVIRONMENT = process.env.NODE_ENV || "local";
const DOCUMENTATION = process.env.DOCUMENTATION === "true";
const DOCUMENTATION_NAME = process.env.DOCUMENTATION_NAME || "api_documentation";
const PORT = Number(process.env.PORT) || 9427;

const DB_URL = process.env.SUPABASE_URL!;
const DB_KEY = process.env.SUPABASE_ADMIN_KEY!;

const PB_TYPEGEN_EMAIL = process.env.PB_TYPEGEN_EMAIL || "";
const PB_TYPEGEN_PASSWORD = process.env.PB_TYPEGEN_PASSWORD || "";
const PB_TYPEGEN_URL = process.env.PB_TYPEGEN_URL || "";

const WEBHOOK_ID = process.env.DISCORD_WEBHOOK_ID || "";
const WEBHOOK_TOKEN = process.env.DISCORD_WEBHOOK_TOKEN || "";

const SMD_SMS_API_URL = process.env.SMD_SMS_API_URL || "http://localhost:9427";
const SMD_SMS_API_PARTNER_ID = process.env.SMD_SMS_API_PARTNER_ID || "";
const SMD_SMS_API_PARTNER_TOKEN = process.env.SMD_SMS_API_PARTNER_TOKEN || "";

const POSTHOG_API_URL = process.env.POSTHOG_API_URL || "https://us.posthog.com";
export {
  ENVIRONMENT,
  DOCUMENTATION,
  PORT,
  PB_TYPEGEN_EMAIL,
  PB_TYPEGEN_PASSWORD,
  PB_TYPEGEN_URL,
  DOCUMENTATION_NAME,
  WEBHOOK_ID,
  WEBHOOK_TOKEN,
  POSTHOG_API_URL,
  DB_URL,
  DB_KEY,
  SMD_SMS_API_URL,
  SMD_SMS_API_PARTNER_ID,
  SMD_SMS_API_PARTNER_TOKEN,
};
