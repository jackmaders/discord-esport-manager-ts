import type {
	CacheType,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { availabilityCommand } from "../../modules/availability/commands/availability-command.ts";
import { configCommand } from "../../modules/config/commands/config-command.ts";
import { loggerService } from "../services/logger.service.ts";
import { GetSlashCommandsLogs } from "./logs/get-slash-commands.logs.ts";

export interface SlashCommand {
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| SlashCommandSubcommandGroupBuilder;

	execute: (
		interaction: ChatInputCommandInteraction<CacheType>,
	) => Promise<void>;
}

const commands = [availabilityCommand, configCommand];

export function getSlashCommands(): SlashCommand[] {
	loggerService.debug(GetSlashCommandsLogs.Start);
	return commands;
}
