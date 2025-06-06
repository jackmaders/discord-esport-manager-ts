import type { GuildConfiguration } from "../../../prisma/generated/prisma-client-js/index.js";
import { guildConfigRepository } from "../repositories/guild-config-repository.ts";
import {} from "../utils/prisma-client-errors.ts";

async function getFullConfig(guildId: string) {
	return await guildConfigRepository.get(guildId);
}

async function setFullConfig(
	guildId: string,
	data: Partial<Omit<GuildConfiguration, "id">>,
) {
	return await guildConfigRepository.update(guildId, data);
}

async function getAvailabilityChannelId(guildId: string) {
	const config = await guildConfigRepository.get(guildId);
	return config?.availabilityChannelId ?? null;
}

async function deleteConfig(guildId: string) {
	await guildConfigRepository.remove(guildId);
}

async function setAvailabilityChannelId(
	guildId: string,
	availabilityChannelId: string,
) {
	return await guildConfigRepository.update(guildId, {
		availabilityChannelId,
	});
}

async function getTeamMemberRoleId(guildId: string) {
	const config = await guildConfigRepository.get(guildId);
	return config?.teamMemberRoleId ?? null;
}

async function setTeamMemberRoleId(guildId: string, roleId: string) {
	return await guildConfigRepository.update(guildId, {
		teamMemberRoleId: roleId,
	});
}

async function getTrialRoleId(guildId: string) {
	const config = await guildConfigRepository.get(guildId);
	return config?.trialRoleId ?? null;
}

async function setTrialRoleId(guildId: string, roleId: string) {
	return await guildConfigRepository.update(guildId, { trialRoleId: roleId });
}

// --- Export the Service Object ---
export const guildConfigService = {
	getFullConfig,
	setFullConfig,
	deleteConfig,
	getAvailabilityChannelId,
	setAvailabilityChannelId,
	getTeamMemberRoleId,
	setTeamMemberRoleId,
	getTrialRoleId,
	setTrialRoleId,
};
