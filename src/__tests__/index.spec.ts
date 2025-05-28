import { type ClientUser, Events } from "discord.js";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import discordClient from "../core/clients/discord.client";
import logMessages from "../core/constants/log-messages";
import commandsService from "../core/services/command.service";
import loggerService from "../core/services/logger.service";
import schedulerService from "../core/services/scheduler.service";
import translationService from "../core/services/translation.service";
import exitProcess from "../core/utils/exit-process";

describe("index.ts", () => {
	afterEach(() => {
		vi.resetModules();
		vi.resetAllMocks();
	});

	afterAll(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
	});

	it("should initialise all core services", async () => {
		// Act
		await import("../index");

		// Assert
		expect(loggerService.initialise).toHaveBeenCalled();
		expect(schedulerService.initialise).toHaveBeenCalled();
		expect(translationService.initialise).toHaveBeenCalled();
		expect(commandsService.initialise).toHaveBeenCalled();
	});

	it("should assign the Error discord.js event listener", async () => {
		// Arrange
		const error = new Error("Test error");
		vi.mocked(discordClient).on.mockImplementation((_, fn) => {
			fn(error);
			return discordClient;
		});

		// Act
		await import("../index");

		// Assert
		expect(discordClient.on).toHaveBeenCalledWith(
			Events.Error,
			expect.any(Function),
		);
		expect(loggerService.error).toHaveBeenCalledWith(error);
	});

	it("should assign the Warn discord.js event listener", async () => {
		// Arrange
		const message = "Test warning";
		vi.mocked(discordClient).on.mockImplementation((_, fn) => {
			fn(message);
			return discordClient;
		});

		// Act
		await import("../index");

		// Assert
		expect(discordClient.on).toHaveBeenCalledWith(
			Events.Warn,
			expect.any(Function),
		);
		expect(loggerService.warn).toHaveBeenCalledWith(message);
	});

	it("should assign the InteractionCreate discord.js event listener", async () => {
		// Arrange
		const interaction = {
			message: "Test interaction",
		};
		vi.mocked(discordClient).on.mockImplementation((_, fn) => {
			fn(interaction);
			return discordClient;
		});

		// Act
		await import("../index");

		// Assert
		expect(discordClient.on).toHaveBeenCalledWith(
			Events.InteractionCreate,
			expect.any(Function),
		);
		expect(commandsService.handleInteraction).toHaveBeenCalledWith(interaction);
	});

	it("should assign the ClientReady discord.js event listener", async () => {
		// Arrange
		vi.mocked(discordClient).once.mockImplementation((_, fn) => {
			fn();
			return discordClient;
		});

		// Act
		await import("../index");

		// Assert
		expect(discordClient.once).toHaveBeenCalledWith(
			Events.ClientReady,
			expect.any(Function),
		);
		expect(loggerService.info).toHaveBeenCalledWith(logMessages.INFO_BOT_READY);
	});

	it("should login to the discord client", async () => {
		// Arrange
		vi.stubEnv("DISCORD_BOT_TOKEN", "DISCORD_BOT_TOKEN");
		vi.mocked(discordClient).user = { tag: "TestUser#1234" } as ClientUser;

		// Act
		await import("../index");

		// Assert
		expect(discordClient.login).toHaveBeenCalledWith("DISCORD_BOT_TOKEN");
		expect(loggerService.info).toHaveBeenCalledWith(
			logMessages.INFO_BOT_LOGIN,
			discordClient.user?.tag,
		);
	});

	it("should log an error and exit on failure", async () => {
		// Arrange
		const error = new Error("Login failed");
		vi.mocked(discordClient).login.mockRejectedValueOnce(error);
		vi.spyOn(console, "error").mockImplementation(vi.fn());

		// Act
		await import("../index");

		// Assert
		expect(console.error).toHaveBeenCalledWith(error);
		expect(exitProcess).toHaveBeenCalledWith(1);
	});

	it("should setup even handlers for SIGINT and SIGTERM", async () => {
		// Arrange
		vi.spyOn(process, "on").mockImplementation(vi.fn());

		// Act
		await import("../index");

		// Assert
		expect(process.on).toHaveBeenCalledWith("SIGINT", expect.any(Function));
		expect(process.on).toHaveBeenCalledWith("SIGTERM", expect.any(Function));
	});
});

vi.mock("../core/services/commands.service");
vi.mock("../core/services/logger.service");
vi.mock("../core/services/scheduler.service");
vi.mock("../core/services/translation.service");
vi.mock("../core/clients/discord.client");
vi.mock("../core/utils/exit-process");
