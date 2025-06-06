import {
	type CacheType,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import { t } from "i18next";
import { GuildOnlyError } from "../../../shared/errors/guild-only-error.ts";
import { discordService } from "../../../shared/services/discord-service.ts";
import { guildConfigService } from "../../../shared/services/guild-config-service.ts";
import { sendAvailabilityPoll } from "../ui/availability-poll.ts";

export async function handleAvailabilityQuery(
	interaction: ChatInputCommandInteraction<CacheType>,
) {
	if (!interaction.guildId) {
		throw new GuildOnlyError(interaction.commandName);
	}

	const channelId = await guildConfigService.getAvailabilityChannelId(
		interaction.guildId,
	);

	const channel = channelId
		? await discordService.fetchTextChannel(channelId)
		: interaction.channel;

	await sendAvailabilityPoll(channel, interaction.guildId);

	await interaction.reply({
		content: t("availability:pollCreated"),
		flags: [MessageFlags.Ephemeral],
	});
}
