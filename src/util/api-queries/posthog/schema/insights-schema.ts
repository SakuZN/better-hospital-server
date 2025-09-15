import { z } from "zod";
import { TrendsQueryNodeSchema } from "./trends-schema";
import { RetentionQueryNodeSchema } from "./retention-schema";

// The main query object that will be sent in the request body.
export const InsightQuerySchema = z.object({
  query: z.discriminatedUnion("kind", [
    TrendsQueryNodeSchema,
    RetentionQueryNodeSchema,
  ]),
});

// The response for a POST to /insights/ is the full Insight object.
// This schema is now more robust to handle nulls for on-the-fly queries.
export const InsightResponseSchema = z.object({
  result: z.array(z.any()).nullable(),
  id: z.number(),
  short_id: z.string(),
  last_refresh: z.string().nullable(),
  is_cached: z.boolean().nullable(),
  hogql: z.string().nullable(),
  next: z.string().url().nullable().optional(),
});

export type InsightQuery = z.infer<typeof InsightQuerySchema>;
export type InsightResponse = z.infer<typeof InsightResponseSchema>;