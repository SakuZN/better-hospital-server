import { makeApi, Zodios } from "@zodios/core";
import { executeWebhookEndpoint } from "./endpoints";
import { createSafeClient } from "@/util/api-queries/plugins";

const discordApi = makeApi([executeWebhookEndpoint]);

// Create the standard Zodios client
const client = new Zodios("https://discord.com", discordApi);

export const discordClient = createSafeClient(client, discordApi);
