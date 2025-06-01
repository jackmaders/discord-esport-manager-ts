import { Events } from "discord.js";
import { discordClient } from "./core/clients/discord-client.ts";
import { getEnvironmentVariables } from "./core/config/get-environment-variables.ts";
import { LogMessages } from "./core/constants/log-messages.ts";
import { commandService } from "./core/services/command-service.ts";
import { loggerService } from "./core/services/logger-service.ts";
import { schedulerService } from "./core/services/scheduler-service.ts";
import { translationService } from "./core/services/translation-service.ts";
import { exitProcess } from "./core/utils/exit-process.ts";

export async function main() {
	try {
		loggerService.initialise();
		schedulerService.initialise();
		await translationService.initialise();
		await commandService.initialise();

		discordClient.on(Events.Error, (error) => loggerService.error(error));
		discordClient.on(Events.Warn, (message) => loggerService.warn(message));
		discordClient.on(Events.InteractionCreate, (interaction) =>
			commandService.handleInteraction(interaction),
		);
		discordClient.once(Events.ClientReady, () =>
			loggerService.info(LogMessages.InfoBotReady),
		);

		await discordClient.login(getEnvironmentVariables().DISCORD_BOT_TOKEN);
		loggerService.info(LogMessages.InfoBotLogin, discordClient.user?.tag);
	} catch (error) {
		loggerService.error(error);
		exitProcess(1);
	}
}
