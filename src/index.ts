import { Events } from "discord.js";
import CommandHandler from "./core/CommandHandler";
import client from "./core/client";
import LogMessages from "./core/constants/LogMessages";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

(async () => {
	if (!BOT_TOKEN)
		throw new Error("Missing required environment variable: DISCORD_BOT_TOKEN");
	if (!CLIENT_ID)
		throw new Error("Missing required environment variable: DISCORD_CLIENT_ID");

	try {
		// TODO: Implement a logger library
		console.info(LogMessages.MAIN_INFO_BOT_START);
		client.on(Events.Error, console.error);
		client.on(Events.Warn, console.warn);
		const commandHandler = new CommandHandler(BOT_TOKEN, CLIENT_ID, GUILD_ID);

		client.on(
			Events.InteractionCreate,
			commandHandler.handleInteraction.bind(commandHandler),
		);

		client.once(Events.ClientReady, () =>
			console.info(LogMessages.MAIN_INFO_BOT_READY),
		);

		await client.login(BOT_TOKEN);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
})();

process.on("SIGINT", () => {
	console.info(LogMessages.MAIN_INFO_BOT_SHUTDOWN);
	client.destroy();
	process.exit(0);
});

process.on("SIGTERM", () => {
	console.info(LogMessages.MAIN_INFO_BOT_SHUTDOWN);
	client.destroy();
	process.exit(0);
});
