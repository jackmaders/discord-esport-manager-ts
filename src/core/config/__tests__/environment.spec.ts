import { afterAll, afterEach, describe, expect, it, vi } from "vitest";

describe("environment.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});

	afterAll(() => {
		vi.unstubAllEnvs();
	});

	it("should export the environment variables", async () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "info");
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		const { default: getEnvironmentVariables } = await import(
			"../get-environment-variables"
		);

		expect(getEnvironmentVariables()).toEqual({
			DISCORD_BOT_TOKEN: "discord-bot-token",
			DISCORD_CLIENT_ID: "discord-client-id",
			NODE_ENV: "test",
			PINO_LOG_LEVEL: "info",
			PRISMA_DATABASE_URL: "file:./dev.db",
			SKIP_COMMAND_REGISTRATION: true,
		});
	});

	it("should use the defaults for optional variables", async () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", undefined);
		vi.stubEnv("PINO_LOG_LEVEL", undefined);
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", undefined);

		const { default: getEnvironmentVariables } = await import(
			"../get-environment-variables"
		);

		expect(getEnvironmentVariables()).toEqual({
			DISCORD_BOT_TOKEN: "discord-bot-token",
			DISCORD_CLIENT_ID: "discord-client-id",
			NODE_ENV: "production",
			PINO_LOG_LEVEL: "info",
			PRISMA_DATABASE_URL: "file:./dev.db",
			SKIP_COMMAND_REGISTRATION: false,
		});
	});

	it("should handle if SKIP_COMMAND_REGISTRATION is a non-'true' string", async () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", undefined);
		vi.stubEnv("PINO_LOG_LEVEL", undefined);
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "test");

		const { default: getEnvironmentVariables } = await import(
			"../get-environment-variables"
		);

		expect(getEnvironmentVariables()).toEqual({
			DISCORD_BOT_TOKEN: "discord-bot-token",
			DISCORD_CLIENT_ID: "discord-client-id",
			NODE_ENV: "production",
			PINO_LOG_LEVEL: "info",
			PRISMA_DATABASE_URL: "file:./dev.db",
			SKIP_COMMAND_REGISTRATION: false,
		});
	});

	it("should throw an error if DISCORD_BOT_TOKEN is missing", async () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", undefined);
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "info");
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		const { default: getEnvironmentVariables } = await import(
			"../get-environment-variables"
		);
		expect(getEnvironmentVariables).toThrowError(
			"Invalid input: expected string, received undefined",
		);
	});

	it("should throw an error if DISCORD_CLIENT_ID is missing", async () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", undefined);
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "info");
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		const { default: getEnvironmentVariables } = await import(
			"../get-environment-variables"
		);

		expect(getEnvironmentVariables).toThrowError(
			"Invalid input: expected string, received undefined",
		);
	});

	it("should throw an error if PRISMA_DATABASE_URL is missing", async () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "info");
		vi.stubEnv("PRISMA_DATABASE_URL", undefined);
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		const { default: getEnvironmentVariables } = await import(
			"../get-environment-variables"
		);

		expect(getEnvironmentVariables).toThrowError(
			"Invalid input: expected string, received undefined",
		);
	});

	it("should throw an error if invalid PINO_LOG_LEVEL is passed", async () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "test");
		vi.stubEnv("PRISMA_DATABASE_URL", "file:./dev.db");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		const { default: getEnvironmentVariables } = await import(
			"../get-environment-variables"
		);

		expect(getEnvironmentVariables).toThrowError(
			'Invalid option: expected one of \\"trace\\"|\\"debug\\"|\\"info\\"|\\"warn\\"|\\"error\\"|\\"fatal\\"',
		);
	});

	it("should throw an error if invalid PRISMA_DATABASE_URL is passed", async () => {
		vi.stubEnv("DISCORD_BOT_TOKEN", "discord-bot-token");
		vi.stubEnv("DISCORD_CLIENT_ID", "discord-client-id");
		vi.stubEnv("NODE_ENV", "test");
		vi.stubEnv("PINO_LOG_LEVEL", "info");
		vi.stubEnv("PRISMA_DATABASE_URL", "test");
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");

		const { default: getEnvironmentVariables } = await import(
			"../get-environment-variables"
		);

		expect(getEnvironmentVariables).toThrowError("Invalid URL");
	});
});
