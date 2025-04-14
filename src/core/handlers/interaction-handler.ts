import {
	type Interaction,
	type InteractionReplyOptions,
	MessageFlags,
	type MessagePayload,
} from "discord.js";
import { CommandNotFoundError } from "../../shared/errors/CommandNotFound";
import LogMessages from "../logger/messages";
import logger from "../logger/setup";
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
			LogMessages.ERROR_HANDLE_INTERACTION,
			interaction.commandName,
		);

		let content = "An unexpected error occurred while processing your command.";

		if (!interaction.isRepliable()) {
			logger.warn(LogMessages.WARN_INTERACTION_NOT_REPLIABLE);
			return;
		}

		if (error instanceof CommandNotFoundError) {
			content = `The command '/${error.commandName}' could not be found. It might have been removed or changed.`;
			logger.warn(LogMessages.WARN_COMMAND_NOT_FOUND, error.commandName);
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
