import {
	ApplicationIntegrationType,
	type CacheType,
	ChannelType,
	type ChatInputCommandInteraction,
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { CommandNotFoundError } from "../../../shared/errors/CommandNotFound";
import handleConfigChannelSetAvailability from "../handlers/config-channel-set-availability.handler";

const command = {
	data: new SlashCommandBuilder()
		.setName("admin")
		.setDescription("Configure the bot")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
		.setContexts([InteractionContextType.Guild])
		.addSubcommandGroup((group) =>
			group
				.setName("set-channel")
				.setDescription("Manage channel configurations.")
				.addSubcommand((subcommand) =>
					subcommand
						.setName("availability")
						.setDescription("Set the text channel to post availability polls.")
						.addChannelOption((option) =>
							option
								.setName("channel")
								.setDescription("The text channel to post availability polls.")
								.addChannelTypes(ChannelType.GuildText)
								.setRequired(true),
						),
				),
		),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		const group = interaction.options.getSubcommandGroup();
		const subcommand = interaction.options.getSubcommand();

		switch (group) {
			case "set-channel":
				switch (subcommand) {
					case "availability":
						await handleConfigChannelSetAvailability(interaction);
						break;
					default:
						throw new CommandNotFoundError(`${group} ${subcommand}`);
				}
				break;
			default:
				throw new CommandNotFoundError(`${group} ${subcommand}`);
		}
	},
};

export default command;
