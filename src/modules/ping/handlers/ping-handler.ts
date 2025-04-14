import type { CacheType, ChatInputCommandInteraction } from "discord.js";
import { MessageFlags } from "discord.js";
import { t } from "i18next";

export default async function handlePingCommand(
	interaction: ChatInputCommandInteraction<CacheType>,
): Promise<void> {
	await interaction.reply({
		content: t("ping:pinging"),
		flags: [MessageFlags.Ephemeral],
	});

	const latency = Date.now() - interaction.createdTimestamp;
	const websocketHeartbeat = interaction.client.ws.ping;

	await interaction.editReply(
		t("ping:pong", {
			latency: latency,
			websocketHeartbeat: websocketHeartbeat,
		}),
	);
}
