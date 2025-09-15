import PocketBase from "pocketbase";
import {
  PB_TYPEGEN_EMAIL,
  PB_TYPEGEN_PASSWORD,
  PB_TYPEGEN_URL,
} from "@/config";
import {
  ActivityLogMethodOptions,
  TypedPocketBase,
} from "@/util/pocketbase/types";
export interface LogData {
  startTime: [number, number];
  method?: ActivityLogMethodOptions;
  route?: string;
  domain?: string;
  ip_address?: string;
  user_agent?: string;
  query_params?: string;
  route_params?: string;
  body?: unknown;
  status_code?: number;
  response_time?: number; // in milliseconds
  response_size?: number;
  raw_response?: unknown;
  error_message?: string;
  stack_trace?: string;
}
if (!PB_TYPEGEN_URL) {
  console.error("PB_TYPEGEN_URL is not defined");
  throw new Error("POCKETBASE_URL is not defined");
}

let pocketbaseInstance: TypedPocketBase | null = null;

function pocketbaseClient() {
  if (pocketbaseInstance) {
    pocketbaseInstance.autoCancellation(false);
    return pocketbaseInstance;
  }

  if (!PB_TYPEGEN_URL || !PB_TYPEGEN_EMAIL || !PB_TYPEGEN_PASSWORD) {
    console.error("PB_TYPEGEN_URL, EMAIL, OR PASSWORD is not defined");
    throw new Error("PB_TYPEGEN_URL, EMAIL, OR PASSWORD is not defined");
  }

  try {
    const pocketbase = new PocketBase(PB_TYPEGEN_URL) as TypedPocketBase;
    pocketbase
      .collection("_superusers")
      .authWithPassword(PB_TYPEGEN_EMAIL, PB_TYPEGEN_PASSWORD, {
        autoRefreshThreshold: 30 * 60,
      })
      .then(() => {
        console.log("Pocketbase Instance created");
      });
    pocketbaseInstance = pocketbase;
    pocketbaseInstance.autoCancellation(false);
    return pocketbase;
  } catch (e) {
    console.error(e);
    throw new Error("Pocketbase Instance not created");
  }
}

export default pocketbaseClient;
