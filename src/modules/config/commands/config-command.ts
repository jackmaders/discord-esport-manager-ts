import {
	ApplicationIntegrationType,
	type CacheType,
	ChannelType,
	type ChatInputCommandInteraction,
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { CommandNotFoundError } from "../../../shared/errors/command-not-found-error.ts";
import { handleConfigChannelSetAvailability } from "../handlers/config-channel-set-availability.handler.ts";
import { handleConfigRoleSetTeamMember } from "../handlers/config-role-set-team-member.handler.ts";
import { handleConfigRoleSetTrial } from "../handlers/config-role-set-trial.handler.ts";

export const configCommand = {
	data: new SlashCommandBuilder()
		.setName("admin")
		.setDescription("Configure the bot")
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
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
		)
		.addSubcommandGroup((group) =>
			group
				.setName("set-role")
				.setDescription("Manage role configurations.")
				.addSubcommand((subcommand) =>
					subcommand
						.setName("team-member")
						.setDescription("Set the role assigned to team members.")
						.addRoleOption((option) =>
							option
								.setName("role")
								.setDescription("The role for team members.")
								.setRequired(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName("trial")
						.setDescription("Set the role assigned to trial members.")
						.addRoleOption((option) =>
							option
								.setName("role")
								.setDescription("The role for trial.")
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
			case "set-role":
				switch (subcommand) {
					case "team-member":
						await handleConfigRoleSetTeamMember(interaction);
						break;
					case "trial":
						await handleConfigRoleSetTrial(interaction);
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
