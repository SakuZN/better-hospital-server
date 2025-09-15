import { z } from "zod";
import { InsightDateRangeSchema } from "./common-schema";

const RetentionEventsEntitySchema = z.object({
  id: z.string(), // e.g., "$pageview"
  name: z.string(), // e.g., "$pageview"
  type: z.literal("events"),
});

// Filters for Retention
export const RetentionFilterSchema = z.object({
  period: z.enum(["Day", "Week", "Month"]).optional(),
  totalIntervals: z.number().optional().default(11),
  targetEntity: RetentionEventsEntitySchema,
  returningEntity: RetentionEventsEntitySchema,
  retentionType: z.enum(["retention_recurring", "retention_first_time"]),
});

// The main RetentionQuery node
export const RetentionQueryNodeSchema = z.object({
  kind: z.literal("RetentionQuery"),
  retentionFilter: RetentionFilterSchema,
  filterTestAccounts: z.boolean().optional(),
  dateRange: InsightDateRangeSchema.optional(),
});

// The response structure for a retention query
const RetentionValueSchema = z.object({
  count: z.number(),
  people: z.array(z.unknown()),
});

const RetentionResultSchema = z.object({
  values: z.array(RetentionValueSchema),
  label: z.string(),
  date: z.string().datetime(),
});

export const RetentionResponseSchema = z.object({
  results: z.array(RetentionResultSchema),
});

export type RetentionQuery = z.infer<typeof RetentionQueryNodeSchema>;
export type RetentionResponse = z.infer<typeof RetentionResponseSchema>;