import {
	ApplicationIntegrationType,
	InteractionContextType,
	SlashCommandBuilder,
} from "discord.js";

export default new SlashCommandBuilder()
	.setName("ping")
	// Temporary hard-coded text
	// Will be replaced a translation function when i18n is implemented.
	.setDescription("Replies with Pong! and shows bot latency.")
	.setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
	.setContexts([InteractionContextType.Guild]);
