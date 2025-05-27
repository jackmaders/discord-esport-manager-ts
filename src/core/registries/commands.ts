import type {
	CacheType,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import availabilityCommand from "../../modules/availability/commands/availability.command";
import configCommand from "../../modules/config/commands/config.command";

export default [availabilityCommand, configCommand] as SlashCommand[];

export interface SlashCommand {
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| SlashCommandSubcommandGroupBuilder;

	execute: (
		interaction: ChatInputCommandInteraction<CacheType>,
	) => Promise<void>;
}
