import {
	type Interaction,
	type InteractionReplyOptions,
	MessageFlags,
	type MessagePayload,
} from "discord.js";
import { t } from "i18next";
import { CommandNotFoundError } from "../../shared/errors/CommandNotFound";
import logger from "../logger";
import logMessages from "../logger/messages";
import type CommandsService from "../services/commands.service";

async function handleInteraction(
	interaction: Interaction,
	commandsService: CommandsService,
) {
	if (!interaction.isChatInputCommand()) return;
	try {
		await commandsService.handleInteraction(interaction);
	} catch (error) {
		logger.error(
			error,
			logMessages.ERROR_HANDLE_INTERACTION,
			interaction.commandName,
		);

		let content = t("common:errorOccurred");

		if (!interaction.isRepliable()) {
			logger.warn(logMessages.WARN_INTERACTION_NOT_REPLIABLE);
			return;
		}

		if (error instanceof CommandNotFoundError) {
			content = t("common:errorCommandNotFound", {
				commandName: error.commandName,
			});
			logger.warn(logMessages.WARN_COMMAND_NOT_FOUND, error.commandName);
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
