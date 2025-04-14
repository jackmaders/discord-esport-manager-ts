import { Events } from "discord.js";
import client from "./core/client";
import handleInteraction from "./core/handlers/interaction-handler";
import initI18n from "./core/i18n";
import logger from "./core/logger";
import logMessages from "./core/logger/messages";
import CommandsService from "./core/services/commands.service";
import prismaClient from "./shared/data/prisma";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

(async () => {
	if (!BOT_TOKEN)
		throw new Error("Missing required environment variable: DISCORD_BOT_TOKEN");
	if (!CLIENT_ID)
		throw new Error("Missing required environment variable: DISCORD_CLIENT_ID");

	try {
		logger.info(logMessages.INFO_BOT_START);

		await initI18n();

		const commandsService = new CommandsService(BOT_TOKEN, CLIENT_ID, GUILD_ID);
		await commandsService.init();

		client.on(Events.Error, logger.error);
		client.on(Events.Warn, logger.warn);

		client.on(Events.InteractionCreate, (interaction) =>
			handleInteraction(interaction, commandsService),
		);

		client.once(Events.ClientReady, () =>
			logger.info(logMessages.INFO_BOT_READY),
		);

		await client.login(BOT_TOKEN);
		logger.info(logMessages.INFO_BOT_LOGIN, client.user?.tag);
	} catch (error) {
		logger.error(error);
		process.exit(1);
	}
})();

process.on("SIGINT", () => {
	logger.info(logMessages.INFO_BOT_SHUTDOWN);
	prismaClient.$disconnect();
	client.destroy();
	process.exit(0);
});

process.on("SIGTERM", () => {
	logger.info(logMessages.INFO_BOT_SHUTDOWN);
	prismaClient.$disconnect();
	client.destroy();
	process.exit(0);
});
