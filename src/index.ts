import { Events } from "discord.js";
import discordClient from "./core/clients/discord.client";
import environment from "./core/config/environment";
import logMessages from "./core/constants/log-messages";
import commandsService from "./core/services/commands.service";
import loggerService from "./core/services/logger.service";
import schedulerService from "./core/services/scheduler.service";
import translationService from "./core/services/translation.service";
import exitProcess from "./core/utils/exit-process";

(async () => {
	try {
		await loggerService.initialise();
		await schedulerService.initialise();
		await translationService.initialise();
		await commandsService.initialise();

		discordClient.on(Events.Error, (error) => loggerService.error(error));
		discordClient.on(Events.Warn, (message) => loggerService.warn(message));
		discordClient.on(Events.InteractionCreate, (interaction) =>
			commandsService.handleInteraction(interaction),
		);
		discordClient.once(Events.ClientReady, () =>
			loggerService.info(logMessages.INFO_BOT_READY),
		);

		await discordClient.login(environment.DISCORD_BOT_TOKEN);
		loggerService.info(logMessages.INFO_BOT_LOGIN, discordClient.user?.tag);
	} catch (error) {
		console.error(error);
		exitProcess(1);
	}
})();

process.on("SIGINT", () => exitProcess(0));
process.on("SIGTERM", () => exitProcess(0));
