import {
	type CacheType,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import { t } from "i18next";
import { GuildOnlyError } from "../../../shared/errors/GuildOnlyError";
import guildConfigurationRepository from "../../../shared/repositories/guild-configuration.repository";

async function handleConfigChannelSetAvailability(
	interaction: ChatInputCommandInteraction<CacheType>,
) {
	if (!interaction.guildId) throw new GuildOnlyError(interaction.commandName);

	const channel = interaction.options.getChannel("channel", true);

	await guildConfigurationRepository.setAvailabilityChannelId(
		interaction.guildId,
		channel.id,
	);

	await interaction.reply({
		content: t("config:availabilityChannelSet"),
		flags: [MessageFlags.Ephemeral],
	});
}

export default handleConfigChannelSetAvailability;
