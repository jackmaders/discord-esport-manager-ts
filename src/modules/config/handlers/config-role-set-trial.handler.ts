import {
	type CacheType,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import { t } from "i18next";
import { GuildOnlyError } from "../../../shared/errors/guild-only-error.ts";
import { guildConfigurationRepository } from "../../../shared/repositories/guild-configuration.repository";

export async function handleConfigRoleSetTrial(
	interaction: ChatInputCommandInteraction<CacheType>,
) {
	if (!interaction.guildId) {
		throw new GuildOnlyError(interaction.commandName);
	}

	const role = interaction.options.getRole("role", true);

	await guildConfigurationRepository.setTrialRoleId(
		interaction.guildId,
		role.id,
	);

	await interaction.reply({
		content: t("config:availabilityRoleSet"),
		flags: [MessageFlags.Ephemeral],
	});
}
