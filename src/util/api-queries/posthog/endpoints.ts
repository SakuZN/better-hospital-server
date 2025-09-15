import { makeEndpoint, parametersBuilder } from "@zodios/core";
import {
  InsightQuerySchema,
  InsightResponseSchema,
} from "./schema/insights-schema";
import { z } from "zod";

const posthogApiError = z.object({
  type: z.string(),
  code: z.string(),
  detail: z.string(),
  attr: z.string().nullable(),
});

const posthogErrors = [
  { status: 400, schema: posthogApiError, description: "Bad Request" },
  { status: 401, schema: posthogApiError, description: "Unauthorized" },
  { status: 403, schema: posthogApiError, description: "Permission Denied" },
];

export const getInsightsEndpoint = makeEndpoint({
  method: "post",
  path: "/api/projects/:project_id/insights/",
  alias: "getInsights",
  description: "Create an ad-hoc insight query on PostHog",
  parameters: parametersBuilder()
    .addPath("project_id", z.string())
    .addBody(InsightQuerySchema)
    .addHeader("Authorization", z.string())
    .build(),
  response: InsightResponseSchema,
  errors: posthogErrors,
});

export const getInsightResultEndpoint = makeEndpoint({
  method: "get",
  path: "/api/projects/:project_id/insights/:id/",
  alias: "getInsightResult",
  description: "Get the result of a calculated insight by its numeric ID.",
  parameters: parametersBuilder()
    .addPath("project_id", z.string())
    .addPath("id", z.number())
    .addQuery("refresh", z.literal("blocking").optional())
    .addHeader("Authorization", z.string())
    .build(),
  response: InsightResponseSchema,
  errors: posthogErrors,
});