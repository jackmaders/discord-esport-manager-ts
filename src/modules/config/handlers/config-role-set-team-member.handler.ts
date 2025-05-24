import {
	type CacheType,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import { t } from "i18next";
import { GuildOnlyError } from "../../../shared/errors/GuildOnlyError";
import guildConfigurationRepository from "../../../shared/repositories/guild-configuration.repository";

async function handleConfigRoleSetTeamMember(
	interaction: ChatInputCommandInteraction<CacheType>,
) {
	if (!interaction.guildId) throw new GuildOnlyError(interaction.commandName);

	const role = interaction.options.getRole("role", true);

	await guildConfigurationRepository.setTeamMemberRoleId(
		interaction.guildId,
		role.id,
	);

	await interaction.reply({
		content: t("config:availabilityRoleSet"),
		flags: [MessageFlags.Ephemeral],
	});
}

export default handleConfigRoleSetTeamMember;
