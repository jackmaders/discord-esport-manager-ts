import {
	type CacheType,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import { t } from "i18next";
import sendAvailabilityPoll from "../ui/availability-poll.ui";

async function handleAvailabilityQuery(
	interaction: ChatInputCommandInteraction<CacheType>,
) {
	await sendAvailabilityPoll(interaction.channel);

	await interaction.reply({
		content: t("availability:pollCreated"),
		flags: [MessageFlags.Ephemeral],
	});
}

export default handleAvailabilityQuery;
