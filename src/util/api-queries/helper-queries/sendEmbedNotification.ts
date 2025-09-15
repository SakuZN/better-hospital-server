import { discordClient } from "@/util/api-queries";
import { DiscordEmbed } from "@/util/api-queries/discord/schemas";
import { WEBHOOK_ID, WEBHOOK_TOKEN } from "@/config";
interface Props {
  content: DiscordEmbed;
  bot_name?: string;
}

export async function sendEmbedNotification({
  content,
  bot_name = "Notification Bot",
}: Props) {
  if (!WEBHOOK_ID || !WEBHOOK_TOKEN) {
    console.error("Discord webhook ID or token is not set.");
    return;
  }

  const { error } = await discordClient.executeWebhook(
    {
      username: bot_name,
      embeds: [content],
    },
    {
      params: {
        webhook_id: WEBHOOK_ID,
        webhook_token: WEBHOOK_TOKEN,
      },
    },
  );

  if (error) {
    console.error("Failed to send Discord embed:", error.message);
  } else {
    console.log("Discord embed sent successfully!");
  }
}
