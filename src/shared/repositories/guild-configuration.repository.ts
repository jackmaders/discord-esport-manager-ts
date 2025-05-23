import prismaClient from "../data/prisma";

async function getGuildConfiguration(guildId: string) {
	return prismaClient.guildConfiguration.findUnique({
		where: { id: guildId },
	});
}
async function getAvailabilityChannelId(guildId: string) {
	const config = await getGuildConfiguration(guildId);
	return config?.availabilityChannelId ?? null;
}

async function setAvailabilityChannelId(guildId: string, channelId: string) {
	return prismaClient.guildConfiguration.upsert({
		where: { id: guildId },
		update: { availabilityChannelId: channelId },
		create: { id: guildId, availabilityChannelId: channelId },
	});
}

export default {
	getGuildConfiguration,
	getAvailabilityChannelId,
	setAvailabilityChannelId,
};
