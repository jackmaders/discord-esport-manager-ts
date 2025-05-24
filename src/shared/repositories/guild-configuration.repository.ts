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

async function getTeamMemberRoleId(guildId: string) {
	const config = await getGuildConfiguration(guildId);
	return config?.teamMemberRoleId ?? null;
}

async function setTeamMemberRoleId(guildId: string, roleId: string) {
	return prismaClient.guildConfiguration.upsert({
		where: { id: guildId },
		update: { teamMemberRoleId: roleId },
		create: { id: guildId, teamMemberRoleId: roleId },
	});
}

async function getTrialRoleId(guildId: string) {
	const config = await getGuildConfiguration(guildId);
	return config?.trialRoleId ?? null;
}

async function setTrialRoleId(guildId: string, roleId: string) {
	return prismaClient.guildConfiguration.upsert({
		where: { id: guildId },
		update: { trialRoleId: roleId },
		create: { id: guildId, trialRoleId: roleId },
	});
}

export default {
	getGuildConfiguration,
	getAvailabilityChannelId,
	setAvailabilityChannelId,
	getTeamMemberRoleId,
	setTeamMemberRoleId,
	getTrialRoleId,
	setTrialRoleId,
};
