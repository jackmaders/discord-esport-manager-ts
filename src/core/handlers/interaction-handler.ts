import {
	type Interaction,
	type InteractionReplyOptions,
	MessageFlags,
} from "discord.js";
import { t } from "i18next";
import { CommandNotFoundError } from "../../shared/errors/CommandNotFound";

import logMessages from "../constants/log-messages";
import commandsService from "../services/commands.service";
import loggerService from "../services/logger.service";

async function handleInteraction(interaction: Interaction) {
	if (!interaction.isChatInputCommand()) return;
	try {
		await commandsService.handleInteraction(interaction);
	} catch (error) {
		loggerService.error(
			error,
			logMessages.ERROR_HANDLE_INTERACTION,
			interaction.commandName,
		);

		let content = t("common:errorOccurred");

		if (!interaction.isRepliable()) {
			loggerService.warn(logMessages.WARN_INTERACTION_NOT_REPLIABLE);
			return;
		}

		if (error instanceof CommandNotFoundError) {
			content = t("common:errorCommandNotFound", {
				commandName: error.commandName,
			});
			loggerService.warn(logMessages.WARN_COMMAND_NOT_FOUND, error.commandName);
		}

		replyToInteraction(interaction, content);
	}
}

async function replyToInteraction(interaction: Interaction, content: string) {
	if (!interaction.isRepliable()) return;

	const payload: InteractionReplyOptions = {
		content,
		flags: [MessageFlags.Ephemeral],
	};

	if (interaction.replied || interaction.deferred) {
		await interaction.followUp(payload);
	} else {
		await interaction.reply(payload);
	}
}

export default handleInteraction;
