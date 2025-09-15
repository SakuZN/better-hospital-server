import { z } from "zod";
import { parametersBuilder } from "@zodios/core";

export const DiscordEmbedFooterSchema = z.object({
    text: z.string(),
    icon_url: z.string().url().optional(),
});

export const DiscordEmbedImageSchema = z.object({
    url: z.string().url(),
});

export const DiscordEmbedThumbnailSchema = z.object({
    url: z.string().url(),
});

export const DiscordEmbedAuthorSchema = z.object({
    name: z.string(),
    url: z.string().url().optional(),
    icon_url: z.string().url().optional(),
});

export const DiscordEmbedFieldSchema = z.object({
    name: z.string(),
    value: z.string(),
    inline: z.boolean().optional(),
});
export const DiscordEmbedSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    url: z.string().url().optional(),
    timestamp: z.string().datetime().optional(),
    color: z.number().int().optional(),
    footer: DiscordEmbedFooterSchema.optional(),
    image: DiscordEmbedImageSchema.optional(),
    thumbnail: DiscordEmbedThumbnailSchema.optional(),
    author: DiscordEmbedAuthorSchema.optional(),
    fields: z.array(DiscordEmbedFieldSchema).optional(),
});

export const ExecuteWebhookPayloadSchema = z
    .object({
        content: z.string().optional(),
        username: z.string().optional(),
        avatar_url: z.string().url().optional(),
        embeds: z.array(DiscordEmbedSchema).max(10).optional(),
    })
    .refine(
        (data) => !!data.content || (!!data.embeds && data.embeds.length > 0),
        { message: "Payload must have either 'content' or at least one 'embed'." }
    );

export const executeWebhookParameters = parametersBuilder()
    .addPath("webhook_id", z.string())
    .addPath("webhook_token", z.string())
    .addBody(ExecuteWebhookPayloadSchema)
    .build();
export const ExecuteWebhookResponseSchema = z.void();

export type DiscordEmbed = z.infer<typeof DiscordEmbedSchema>;
export type ExecuteWebhookPayload = z.infer<typeof ExecuteWebhookPayloadSchema>;