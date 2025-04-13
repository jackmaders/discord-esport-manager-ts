import type { CacheType, ChatInputCommandInteraction } from "discord.js";
import { MessageFlags } from "discord.js";

export default async function handlePingCommand(
	interaction: ChatInputCommandInteraction<CacheType>,
): Promise<void> {
	// Temporary hard-coded text
	// Will be replaced a translation function when i18n is implemented.
	await interaction.reply({
		content: "Pinging...",
		flags: [MessageFlags.Ephemeral],
	});

	const latency = Date.now() - interaction.createdTimestamp;
	const websocketHeartbeat = interaction.client.ws.ping;

	// Temporary hard-coded text
	// Will be replaced a translation function when i18n is implemented.
	await interaction.editReply(
		`Pong! 🏓\nRound trip latency: ${latency}ms\nWebSocket heartbeat: ${websocketHeartbeat}ms`,
	);
}
