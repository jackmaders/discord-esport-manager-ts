import { Client, GatewayIntentBits } from "discord.js";
import { loggerService } from "../services/logger-service.ts";
import { DiscordClientLogs } from "./logs/discord-client.logs.ts";

const discordClient = new Client({
	intents: [GatewayIntentBits.Guilds],
});

loggerService.info(DiscordClientLogs.DiscordClientInit);

export { discordClient };
