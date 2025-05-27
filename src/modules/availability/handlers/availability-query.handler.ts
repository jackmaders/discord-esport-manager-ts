import {
	type CacheType,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import { t } from "i18next";
import client from "../../../core/clients/discord.client.ts";
import { GuildOnlyError } from "../../../shared/errors/GuildOnlyError";
import guildConfigurationRepository from "../../../shared/repositories/guild-configuration.repository";
import sendAvailabilityPoll from "../ui/availability-poll.ui";

async function handleAvailabilityQuery(
	interaction: ChatInputCommandInteraction<CacheType>,
) {
	if (!interaction.guildId) throw new GuildOnlyError(interaction.commandName);

	const channelId = await guildConfigurationRepository.getAvailabilityChannelId(
		interaction.guildId,
	);

	const channel = channelId
		? await client.channels.fetch(channelId)
		: interaction.channel;

	if (!channel?.isTextBased()) return;

	await sendAvailabilityPoll(channel, interaction.guildId);

	await interaction.reply({
		content: t("availability:pollCreated"),
		flags: [MessageFlags.Ephemeral],
	});
}

export default handleAvailabilityQuery;
