import { type ClientUser, Events } from "discord.js";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { discordClient } from "../core/clients/discord.client.ts";
import { LogMessages } from "../core/constants/log-messages.ts";
import { commandService } from "../core/services/command.service.ts";
import { loggerService } from "../core/services/logger.service.ts";
import { schedulerService } from "../core/services/scheduler.service.ts";
import { translationService } from "../core/services/translation.service.ts";
import { exitProcess } from "../core/utils/exit-process.ts";
import { main } from "../main.ts";

describe("main.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});

	afterAll(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
	});

	it("should initialise all core services", async () => {
		// Act
		await main();

		// Assert
		expect(loggerService.initialise).toHaveBeenCalled();
		expect(schedulerService.initialise).toHaveBeenCalled();
		expect(translationService.initialise).toHaveBeenCalled();
		expect(commandService.initialise).toHaveBeenCalled();
	});

	it("should assign the Error discord.js event listener", async () => {
		// Arrange
		const error = new Error("Test error");
		vi.mocked(discordClient).on.mockImplementation((_, fn) => {
			fn(error);
			return discordClient;
		});

		// Act
		await main();

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
		await main();

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
		await main();

		// Assert
		expect(discordClient.on).toHaveBeenCalledWith(
			Events.InteractionCreate,
			expect.any(Function),
		);
		expect(commandService.handleInteraction).toHaveBeenCalledWith(interaction);
	});

	it("should assign the ClientReady discord.js event listener", async () => {
		// Arrange
		vi.mocked(discordClient).once.mockImplementation((_, fn) => {
			fn();
			return discordClient;
		});

		// Act
		await main();

		// Assert
		expect(discordClient.once).toHaveBeenCalledWith(
			Events.ClientReady,
			expect.any(Function),
		);
		expect(loggerService.info).toHaveBeenCalledWith(LogMessages.InfoBotReady);
	});

	it("should login to the discord client", async () => {
		// Arrange
		vi.stubEnv("DISCORD_BOT_TOKEN", "DISCORD_BOT_TOKEN");
		vi.mocked(discordClient).user = { tag: "TestUser#1234" } as ClientUser;

		// Act
		await main();

		// Assert
		expect(discordClient.login).toHaveBeenCalledWith("DISCORD_BOT_TOKEN");
		expect(loggerService.info).toHaveBeenCalledWith(
			LogMessages.InfoBotLogin,
			discordClient.user?.tag,
		);
	});

	it("should log an error and exit on failure", async () => {
		// Arrange
		const error = new Error("Login failed");
		vi.mocked(discordClient).login.mockRejectedValueOnce(error);
		vi.spyOn(console, "error").mockImplementation(vi.fn());

		// Act
		await main();

		// Assert
		expect(console.error).toHaveBeenCalledWith(error);
		expect(exitProcess).toHaveBeenCalledWith(1);
	});
});

vi.mock("../core/services/command.service.ts");
vi.mock("../core/services/logger.service.ts");
vi.mock("../core/services/scheduler.service.ts");
vi.mock("../core/services/translation.service.ts");
vi.mock("../core/clients/discord.client.ts");
vi.mock("../core/utils/exit-process.ts");
