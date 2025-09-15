import { z } from "zod";
import {
  InsightDateRangeSchema,
  IntervalSchema,
  SeriesNodeSchema,
} from "./common-schema";

// Filters for Trends
export const TrendsFilterSchema = z.object({
  display: z
    .enum([
      "ActionsLineGraph",
      "ActionsTable",
      "ActionsPie",
      "ActionsBar",
      "ActionsBarValue",
      "WorldMap",
      "BoldNumber",
    ])
    .optional(),
});

export const BreakdownFilterSchema = z.object({
  breakdown: z.string().optional(),
  breakdown_type: z.enum(["event", "person", "cohort", "group", "hogql"]).optional(),
  breakdown_limit: z.number().optional(),
});

// The main TrendsQuery node
export const TrendsQueryNodeSchema = z.object({
  kind: z.literal("TrendsQuery"),
  series: z.array(SeriesNodeSchema),
  interval: IntervalSchema.optional(),
  trendsFilter: TrendsFilterSchema.optional(),
  breakdownFilter: BreakdownFilterSchema.optional(),
  filterTestAccounts: z.boolean().optional(),
  // Correctly define dateRange as a nested object
  dateRange: InsightDateRangeSchema.optional(),
});

// The response structure for a trends query
const TrendResultSchema = z.object({
  action: z.any().optional(),
  label: z.string(),
  count: z.number(),
  data: z.array(z.number()),
  labels: z.array(z.string()),
  days: z.array(z.string()),
  breakdown_value: z.union([z.string(), z.number()]).optional(),
});

export const TrendsResponseSchema = z.object({
  results: z.array(TrendResultSchema),
  next: z.string().url().nullable().optional(),
});

export type TrendsQuery = z.infer<typeof TrendsQueryNodeSchema>;
export type TrendsResponse = z.infer<typeof TrendsResponseSchema>;