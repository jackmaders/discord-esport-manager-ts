import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { getEnvironmentVariables } from "../get-environment-variables.ts";

describe("get-environment-variables.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});

	afterAll(() => {
		vi.unstubAllEnvs();
	});

	it("should export the environment variables", () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "info");
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		const {
			DISCORD_BOT_TOKEN,
			DISCORD_CLIENT_ID,
			NODE_ENV,
			PINO_LOG_LEVEL,
			PRISMA_DATABASE_URL,
			SKIP_COMMAND_REGISTRATION,
		} = getEnvironmentVariables();

		expect(DISCORD_BOT_TOKEN).toBe("discord-bot-token");
		expect(DISCORD_CLIENT_ID).toBe("discord-client-id");
		expect(NODE_ENV).toBe("test");
		expect(PINO_LOG_LEVEL).toBe("info");
		expect(PRISMA_DATABASE_URL).toBe("file:./dev.db");
		expect(SKIP_COMMAND_REGISTRATION).toBe(true);
	});

	it("should use the defaults for optional variables", () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", undefined);
		vi.stubEnv("PINO_LOG_LEVEL", undefined);
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", undefined);

		const {
			DISCORD_BOT_TOKEN,
			DISCORD_CLIENT_ID,
			NODE_ENV,
			PINO_LOG_LEVEL,
			PRISMA_DATABASE_URL,
			SKIP_COMMAND_REGISTRATION,
		} = getEnvironmentVariables();

		expect(DISCORD_BOT_TOKEN).toBe("discord-bot-token");
		expect(DISCORD_CLIENT_ID).toBe("discord-client-id");
		expect(NODE_ENV).toBe("production");
		expect(PINO_LOG_LEVEL).toBe("info");
		expect(PRISMA_DATABASE_URL).toBe("file:./dev.db");
		expect(SKIP_COMMAND_REGISTRATION).toBe(false);
	});

	it("should handle if SKIP_COMMAND_REGISTRATION is a non-'true' string", () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", undefined);
		vi.stubEnv("PINO_LOG_LEVEL", undefined);
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "test");

		const {
			DISCORD_BOT_TOKEN,
			DISCORD_CLIENT_ID,
			NODE_ENV,
			PINO_LOG_LEVEL,
			PRISMA_DATABASE_URL,
			SKIP_COMMAND_REGISTRATION,
		} = getEnvironmentVariables();

		expect(DISCORD_BOT_TOKEN).toBe("discord-bot-token");
		expect(DISCORD_CLIENT_ID).toBe("discord-client-id");
		expect(NODE_ENV).toBe("production");
		expect(PINO_LOG_LEVEL).toBe("info");
		expect(PRISMA_DATABASE_URL).toBe("file:./dev.db");
		expect(SKIP_COMMAND_REGISTRATION).toBe(false);
	});

	it("should throw an error if DISCORD_BOT_TOKEN is missing", () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", undefined);
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "info");
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		expect(getEnvironmentVariables).toThrowError(
			"Invalid input: expected string, received undefined",
		);
	});

	it("should throw an error if DISCORD_CLIENT_ID is missing", () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", undefined);
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "info");
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		expect(getEnvironmentVariables).toThrowError(
			"Invalid input: expected string, received undefined",
		);
	});

	it("should throw an error if PRISMA_DATABASE_URL is missing", () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "info");
		vi.stubEnv("PRISMA_DATABASE_URL", undefined);
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		expect(getEnvironmentVariables).toThrowError(
			"Invalid input: expected string, received undefined",
		);
	});

	it("should throw an error if invalid PINO_LOG_LEVEL is passed", () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "test");
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		expect(getEnvironmentVariables).toThrowError(
			'Invalid option: expected one of \\"trace\\"|\\"debug\\"|\\"info\\"|\\"warn\\"|\\"error\\"|\\"fatal\\"',
		);
	});

	it("should throw an error if invalid PRISMA_DATABASE_URL is passed", () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "info");
		vi.stubEnv("PRISMA_DATABASE_URL", "test");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		expect(getEnvironmentVariables).toThrowError("Invalid URL");
	});
});
