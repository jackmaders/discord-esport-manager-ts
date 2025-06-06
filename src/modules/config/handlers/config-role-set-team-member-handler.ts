import {
	type CacheType,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import { t } from "i18next";
import { GuildOnlyError } from "../../../shared/errors/guild-only-error.ts";
import { guildConfigurationRepository } from "../../../shared/repositories/guild-config-repository.ts";

export async function handleConfigRoleSetTeamMember(
	interaction: ChatInputCommandInteraction<CacheType>,
) {
	if (!interaction.guildId) {
		throw new GuildOnlyError(interaction.commandName);
	}

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
