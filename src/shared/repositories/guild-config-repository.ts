import type { GuildConfiguration } from "../../../prisma/generated/prisma-client-js/index.js";
import { prismaClient } from "../clients/prisma-client.ts";

async function get(guildId: string): Promise<GuildConfiguration | null> {
	return await prismaClient.guildConfiguration.findUnique({
		where: { id: guildId },
	});
}

async function update(
	guildId: string,
	data: Partial<Omit<GuildConfiguration, "id">>,
): Promise<GuildConfiguration> {
	return await prismaClient.guildConfiguration.upsert({
		where: { id: guildId },
		update: data,
		create: { id: guildId, ...data },
	});
}

async function remove(guildId: string): Promise<GuildConfiguration | null> {
	return await prismaClient.guildConfiguration.delete({
		where: { id: guildId },
	});
}

export const guildConfigRepository = {
	get,
	update,
	remove,
};
