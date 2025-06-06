import { ChannelType, type VoiceChannel } from "discord.js";
import { discordClient } from "../../core/clients/discord-client.ts";

async function fetchChannel(channelId: string) {
	return await discordClient.channels.fetch(channelId);
}

async function fetchTextChannel(channelId: string) {
	const channel = await fetchChannel(channelId);
	if (channel?.type !== ChannelType.GuildText) {
		return null;
	}

	return channel;
}

async function fetchVoiceChannel(
	channelId: string,
): Promise<VoiceChannel | null> {
	const channel = await fetchChannel(channelId);
	if (channel?.type !== ChannelType.GuildVoice) {
		return null;
	}
	return channel;
}

export const discordService = {
	fetchChannel,
	fetchTextChannel,
	fetchVoiceChannel,
};
