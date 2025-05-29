import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		mockReset: true,
		env: {
			DISCORD_BOT_TOKEN: "discord-bot-token",
			DISCORD_CLIENT_ID: "discord-client-id",
			NODE_ENV: "test",
			PINO_LOG_LEVEL: "info",
			PRISMA_DATABASE_URL: "file:./dev.db",
			SKIP_COMMAND_REGISTRATION: "false",
		},
		coverage: {
			exclude: ["prisma/generated", "*.config.ts"],
		},
	},
});
