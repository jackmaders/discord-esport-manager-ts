import { Events } from "discord.js";
import { discordClient } from "./core/clients/discord-client.ts";
import { getEnvironmentVariables } from "./core/config/get-environment-variables.ts";
import { LogMessages } from "./core/constants/log-messages.ts";
import { commandService } from "./core/services/command.service";
import { loggerService } from "./core/services/logger.service";
import { schedulerService } from "./core/services/scheduler.service";
import { translationService } from "./core/services/translation.service";
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
		// biome-ignore lint/suspicious/noConsole: fallback for logging errors
		console.error(error);
		exitProcess(1);
	}
}
