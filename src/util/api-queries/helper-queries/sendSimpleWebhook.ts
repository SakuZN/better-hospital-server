import { discordClient } from "@/util/api-queries";
import { WEBHOOK_ID, WEBHOOK_TOKEN } from "@/config";

interface Props {
  content: string;
  bot_name?: string;
}

export async function sendSimpleNotification({
  content,
  bot_name = "Notification Bot",
}: Props) {
  if (!WEBHOOK_ID || !WEBHOOK_TOKEN) {
    console.error("Discord webhook ID or token is not set.");
    return;
  }
  const { error } = await discordClient.executeWebhook(
    {
      content: content,
      username: bot_name,
    },
    {
      params: {
        webhook_id: WEBHOOK_ID,
        webhook_token: WEBHOOK_TOKEN,
      },
    },
  );

  if (error) {
    console.error("Failed to send Discord notification:", error.message);
  } else {
    console.log("Discord notification sent successfully!");
  }
}
