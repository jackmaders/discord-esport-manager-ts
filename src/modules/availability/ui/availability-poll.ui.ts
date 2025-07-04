import type { SendableChannels, TextBasedChannel } from "discord.js";
import { t } from "i18next";
import guildConfigurationRepository from "../../../shared/repositories/guild-configuration.repository";
import getNextMonday from "../utils/getNextMonday";

async function sendAvailabilityPoll(
	channel: TextBasedChannel | null,
	guildId: string,
) {
	if (!channel?.isSendable()) return;

	const nextMonday = getNextMonday();

	const config =
		await guildConfigurationRepository.getGuildConfiguration(guildId);

	const teamMemberRoleId = config?.teamMemberRoleId;
	const trialRoleId = config?.trialRoleId;

	const answers = new Array(7).fill(null).map((_, index) => {
		const date = new Date(nextMonday);
		date.setDate(nextMonday.getDate() + index);

		const text = date.toLocaleDateString("en-GB", {
			weekday: "short",
			day: "numeric",
			month: "short",
		});

		return {
			text,
			emoji: `${index + 1}\uFE0F\u20E3`,
		};
	});

	const nextMondayFormatted = nextMonday.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
	});

	// Poll should expire on the upcoming Sunday
	const durationMilliseconds = nextMonday.getTime() - new Date().getTime();
	const durationHours = Math.floor(durationMilliseconds / (1000 * 60 * 60));

	await channel.send({
		content: `<@&${teamMemberRoleId}> <@&${trialRoleId}>`,
		poll: {
			question: {
				text: t("availability:pollHeading", { date: nextMondayFormatted }),
			},
			answers,
			allowMultiselect: true,
			duration: durationHours,
		},
	});
}

export default sendAvailabilityPoll;
