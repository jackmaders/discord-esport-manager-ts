import {
	ApplicationIntegrationType,
	type CacheType,
	type ChatInputCommandInteraction,
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { CommandNotFoundError } from "../../../shared/errors/CommandNotFound";
import handleAvailabilityQuery from "../handlers/availability-query.handler";

const command = {
	data: new SlashCommandBuilder()
		.setName("availability")
		.setDescription("Manage the availability of a team")
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
		.setContexts([InteractionContextType.Guild])
		.addSubcommand((subcommand) =>
			subcommand
				.setName("query")
				.setDescription("Submit a poll to check the availability of the team"),
		),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case "query":
				await handleAvailabilityQuery(interaction);
				break;
			default:
				throw new CommandNotFoundError(subcommand);
		}
	},
};

export default command;
