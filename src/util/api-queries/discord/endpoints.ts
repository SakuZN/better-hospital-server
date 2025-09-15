import { z } from "zod";
import { makeEndpoint, makeErrors } from "@zodios/core";
import {
    executeWebhookParameters,
    ExecuteWebhookResponseSchema,
} from "./schemas";

const DiscordApiErrorSchema = z.object({
    message: z.string(),
    code: z.number(),
});

export const executeWebhookEndpoint = makeEndpoint({
    method: "post",
    path: "/api/webhooks/:webhook_id/:webhook_token",
    alias: "executeWebhook",
    description: "Post a message to a Discord channel via a webhook.",
    parameters: executeWebhookParameters,
    status: 204,
    response: ExecuteWebhookResponseSchema,
    errors: makeErrors([
        { status: 400, schema: DiscordApiErrorSchema, description: "Bad Request"},
        { status: 401, schema: DiscordApiErrorSchema, description: "Unauthorized"},
        { status: 404, schema: DiscordApiErrorSchema, description: "Not Found"},
    ]),
});