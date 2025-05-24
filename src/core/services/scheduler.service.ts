import { Cron } from "croner";
import sendAvailabilityPoll from "../../modules/availability/ui/availability-poll.ui";
import prismaClient from "../../shared/data/prisma";
import client from "../client";

export default class SchedulerService {
	public init() {
		this.scheduleWeeklyAvailabilityPoll();
	}

	private scheduleWeeklyAvailabilityPoll() {
		new Cron("0 9 * * 5", { name: "Weekly Availability Poll" }, async () => {
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

				const channel = await client.channels.fetch(
					config.availabilityChannelId,
				);

				if (!channel?.isTextBased()) return;

				await sendAvailabilityPoll(channel, config.id);
			}
		});
	}
}
