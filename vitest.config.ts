// vitest.config.ts (or vite.config.ts)
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		env: {
			DISCORD_BOT_TOKEN: "discord-bot-token",
			DISCORD_CLIENT_ID: "discord-client-id",
			PRISMA_DATABASE_URL: "file:./dev.db",
		},
	},
});
