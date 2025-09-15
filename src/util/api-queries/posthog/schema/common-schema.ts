import { z } from "zod";

// Base Schemas
export const InsightDateRangeSchema = z.object({
  date_from: z.string().optional(), // e.g., "-7d", "2023-01-01"
  date_to: z.string().optional(),
});

export const IntervalSchema = z.enum(["hour", "day", "week", "month"]);

// Node Schemas for defining series/entities
export const BaseNodeSchema = z.object({
  name: z.string().optional(),
  custom_name: z.string().optional(),
  math: z.string().optional(), // e.g., "dau", "total", "sum"
  math_property: z.string().optional(),
  properties: z.array(z.any()).optional(),
});

export const EventsNodeSchema = BaseNodeSchema.extend({
  kind: z.literal("EventsNode"),
  event: z.string(),
});

export const ActionsNodeSchema = BaseNodeSchema.extend({
  kind: z.literal("ActionsNode"),
  id: z.number(),
});

export const SeriesNodeSchema = z.union([EventsNodeSchema, ActionsNodeSchema]);