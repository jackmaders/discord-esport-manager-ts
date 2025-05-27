import discordClient from "../../../core/clients/discord.client.ts";
import prismaClient from "../../../shared/clients/prisma";
import sendAvailabilityPoll from "../ui/availability-poll.ui";

export default {
	name: "Weekly Availability Poll",
	pattern: "0 18 * * 5", // Every Friday at 18:00
	async execute() {
		const guildsToPoll = await prismaClient.guildConfiguration.findMany({
			where: {
				availabilityChannelId: {
					not: null,
				},
			},
		});

		if (guildsToPoll.length === 0) return;

		for (const config of guildsToPoll) {
			if (!config.availabilityChannelId) continue;

			const channel = await discordClient.channels.fetch(
				config.availabilityChannelId,
			);

			if (!channel?.isTextBased()) return;

			await sendAvailabilityPoll(channel, config.id);
		}
	},
};
