import pocketbaseClient, { LogData } from "@/util/pocketbase";
import { ENVIRONMENT } from "@/config";
import {
  ActivityLogRecord,
  ActivityLogEnvironmentOptions,
  ActivityLogMethodOptions,
  ActivityLogResponseOptions,
} from "@/util/pocketbase/types";
import { FastifyInstance } from "fastify";
import logger from "@/util/local-logger";
import { writeQueue } from "@/util/write-queue";

const formatDuration = (ms: number): string => {
  if (ms < 0) ms = -ms;

  const time = {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: parseFloat((ms / 1000).toFixed(2)) % 60,
  };

  // Create an array of parts to join, filtering out zero values
  const parts = [];
  if (time.d > 0) parts.push(`${time.d}d`);
  if (time.h > 0) parts.push(`${time.h}h`);
  if (time.m > 0) parts.push(`${time.m}m`);
  if (time.s > 0 || parts.length === 0) {
    // Always show seconds, even if 0, if no other parts exist
    parts.push(`${time.s.toFixed(2)}s`);
  }

  return parts.join(" ");
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getEnvironment = (): ActivityLogEnvironmentOptions => {
  const env = (ENVIRONMENT || process.env.NODE_ENV || "local").toLowerCase();
  if (env.startsWith("prod")) return ActivityLogEnvironmentOptions.prod;
  if (env.startsWith("stage") || env.startsWith("development"))
    return ActivityLogEnvironmentOptions.stage;
  return ActivityLogEnvironmentOptions.local;
};

const logActivity = async (data: LogData): Promise<void> => {
  try {
    const pbDB = pocketbaseClient();
    let rawResponse = {};
    if (data.raw_response) {
      if (typeof data.raw_response === "string") {
        try {
          rawResponse = JSON.parse(data.raw_response);
        } catch (e) {
          console.warn("Could not parse raw_response as JSON");
        }
      } else {
        rawResponse = data.raw_response as object;
      }
    }
    let statusCode =
      rawResponse &&
      typeof rawResponse === "object" &&
      "status_code" in rawResponse
        ? (rawResponse as any).status_code
        : data.status_code || 10;
    statusCode =
      typeof statusCode === "string" ? Number(statusCode) : statusCode;
    const payload: Omit<ActivityLogRecord, "id" | "created" | "updated"> = {
      environment: getEnvironment(),
      method: data.method,
      route: data.route,
      ip_address: data.ip_address,
      user_agent: data.user_agent,
      query_params: data.query_params,
      route_params: data.route_params,
      body: data.body || undefined,
      raw_response: rawResponse || undefined,
      status_code: data.status_code,
      response_time: data.response_time
        ? formatDuration(data.response_time)
        : undefined,
      response_size: data.response_size
        ? formatBytes(data.response_size)
        : undefined,

      response:
        statusCode === 0
          ? ActivityLogResponseOptions.OK
          : ActivityLogResponseOptions.ERROR,
      error_message: data.error_message,
      stack_trace: data.stack_trace,
    };

    await pbDB.collection("activity_log").create(payload);
  } catch (error) {
    console.error("FATAL: Failed to write to activity_logs collection.", {
      loggingError: error,
      originalLogData: data,
    });
  }
};

export const logActivityLog = (app: FastifyInstance) => {
  //@ts-ignore
  app.addHook("onRequest", (request, reply, done) => {
    if (request.method === "OPTIONS") {
      return done();
    }
    const protocol = request.protocol;
    const host = request.headers.host;
    const origin = `${protocol}://${host}`;
    logger.info(`Received ${request.method} request for ${request.url}`);
    request.logData = {
      ...(request.logData || {}),
      domain: origin,
      startTime: process.hrtime(),
      method: request.method as ActivityLogMethodOptions,
      route: request.routeOptions.url,
      ip_address: request.ip,
      user_agent: request.headers["user-agent"],
      query_params: request.query ? JSON.stringify(request.query) : undefined,
      body: request.body,
    };
    done();
  });

  //@ts-ignore
  app.addHook("preHandler", (request, reply, done) => {
    if (request.logData && request.params) {
      request.logData.route_params = JSON.stringify(request.params);
    }
    done();
  });

  //@ts-ignore
  app.addHook("onError", (request, reply, error, done) => {
    if (!request.logData) {
      request.logData = { startTime: process.hrtime() };
    }
    request.logData.error_message = error.message;
    request.logData.stack_trace = error.stack;
    done();
  });

  //@ts-ignore
  app.addHook("onSend", (request, reply, payload, done) => {
    if (request.logData) {
      request.logData.raw_response =
        typeof payload === "string" ? payload : JSON.stringify(payload);
      request.logData.status_code =
        typeof payload === "object" &&
        payload !== null &&
        "status_code" in payload
          ? (payload as any).status_code || reply.statusCode
          : reply.statusCode;
    }
    done(null, payload);
  });

  app.addHook("onResponse", (request, reply, done) => {
    if (request.method === "OPTIONS") {
      return done();
    }
    const { logData } = request;
    if (!request.logData) {
      done();
      return;
    }
    const hrtime = process.hrtime(logData.startTime);
    logData.response_time = hrtime[0] * 1000 + hrtime[1] / 1e6;

    const responseSize = reply.getHeader("content-length");
    if (responseSize) {
      logData.response_size = Number(responseSize);
    }

    writeQueue.enqueue(() => logActivity(logData));
    done();
  });
};
