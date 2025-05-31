import { defineConfig } from "vitest/config";

const config = defineConfig({
	test: {
		mockReset: true,
		env: {
			// biome-ignore lint/style/useNamingConvention: environment variable
			DISCORD_BOT_TOKEN: "discord-bot-token",
			// biome-ignore lint/style/useNamingConvention: environment variable
			DISCORD_CLIENT_ID: "discord-client-id",
			// biome-ignore lint/style/useNamingConvention: environment variable
			NODE_ENV: "test",
			// biome-ignore lint/style/useNamingConvention: environment variable
			PINO_LOG_LEVEL: "info",
			// biome-ignore lint/style/useNamingConvention: environment variable
			PRISMA_DATABASE_URL: "file:./dev.db",
			// biome-ignore lint/style/useNamingConvention: environment variable
			SKIP_COMMAND_REGISTRATION: "false",
		},
		coverage: {
			exclude: ["prisma/generated", "*.config.ts"],
		},
	},
});

// biome-ignore lint/style/noDefaultExport: default export is required by Vitest
export default config;
