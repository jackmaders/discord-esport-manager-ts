import {
	type CacheType,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import { t } from "i18next";
import { discordClient } from "../../../core/clients/discord-client.ts";
import { GuildOnlyError } from "../../../shared/errors/guild-only-error.ts";
import { guildConfigurationRepository } from "../../../shared/repositories/guild-configuration-repository.ts";
import { sendAvailabilityPoll } from "../ui/availability-poll.ts";

export async function handleAvailabilityQuery(
	interaction: ChatInputCommandInteraction<CacheType>,
) {
	if (!interaction.guildId) {
		throw new GuildOnlyError(interaction.commandName);
	}

	const channelId = await guildConfigurationRepository.getAvailabilityChannelId(
		interaction.guildId,
	);

	const channel = channelId
		? await discordClient.channels.fetch(channelId)
		: interaction.channel;

	if (!channel?.isTextBased()) {
		return;
	}

	await sendAvailabilityPoll(channel, interaction.guildId);

	await interaction.reply({
		content: t("availability:pollCreated"),
		flags: [MessageFlags.Ephemeral],
	});
}
