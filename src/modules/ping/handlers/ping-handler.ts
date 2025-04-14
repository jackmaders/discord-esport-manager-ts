import type { CacheType, ChatInputCommandInteraction } from "discord.js";
import { MessageFlags } from "discord.js";

export default async function handlePingCommand(
	interaction: ChatInputCommandInteraction<CacheType>,
): Promise<void> {
	await interaction.reply({
		content: "Pinging...",
		flags: [MessageFlags.Ephemeral],
	});

	const latency = Date.now() - interaction.createdTimestamp;
	const websocketHeartbeat = interaction.client.ws.ping;

	await interaction.editReply(
		`Pong! 🏓\nRound trip latency: ${latency}ms\nWebSocket heartbeat: ${websocketHeartbeat}ms`,
	);
}
