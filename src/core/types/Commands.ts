import type {
	CacheType,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandGroupBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface SlashCommand {
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| SlashCommandSubcommandGroupBuilder;

	execute: (
		interaction: ChatInputCommandInteraction<CacheType>,
	) => Promise<void>;
}
