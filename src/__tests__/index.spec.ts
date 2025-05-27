import { type ClientUser, Events } from "discord.js";
import { type Mock, afterEach, describe, expect, it, vi } from "vitest";
import discordClient from "../core/clients/discord.client";
import logMessages from "../core/constants/log-messages";
import commandsService from "../core/services/commands.service";
import loggerService from "../core/services/logger.service";
import schedulerService from "../core/services/scheduler.service";
import translationService from "../core/services/translation.service";
import exitProcess from "../core/utils/exit-process";

describe("index.ts", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		vi.resetModules();
		vi.resetAllMocks();
	});

	it("should initialise the LoggerService", async () => {
		await import("../index");
		expect(loggerService.initialise).toHaveBeenCalled();
	});

	it("should initialise the SchedulerService", async () => {
		await import("../index");
		expect(schedulerService.initialise).toHaveBeenCalled();
	});

	it("should initialise the TranslationService", async () => {
		await import("../index");
		expect(translationService.initialise).toHaveBeenCalled();
	});

	it("should initialise the CommandsService", async () => {
		await import("../index");
		expect(commandsService.initialise).toHaveBeenCalled();
	});

	it("should assign the Error discord.js event fn", async () => {
		const error = new Error("Test error");
		(discordClient.on as Mock).mockImplementation((_, fn) => fn(error));

		await import("../index");
		expect(discordClient.on).toHaveBeenCalledWith(
			Events.Error,
			expect.any(Function),
		);
		expect(loggerService.error).toHaveBeenCalledWith(error);
	});

	it("should assign the Warn discord.js event fn", async () => {
		const message = "Test warning";
		(discordClient.on as Mock).mockImplementation((_, fn) => fn(message));

		await import("../index");
		expect(discordClient.on).toHaveBeenCalledWith(
			Events.Warn,
			expect.any(Function),
		);
		expect(loggerService.warn).toHaveBeenCalledWith(message);
	});

	it("should assign the InteractionCreate discord.js event fn", async () => {
		const interaction = {
			message: "Test interaction",
		};
		(discordClient.on as Mock).mockImplementation((_, fn) => fn(interaction));
		await import("../index");
		expect(discordClient.on).toHaveBeenCalledWith(
			Events.InteractionCreate,
			expect.any(Function),
		);
		expect(commandsService.handleInteraction).toHaveBeenCalledWith(interaction);
	});

	it("should assign the ClientReady discord.js event fn", async () => {
		(discordClient.once as Mock).mockImplementation((_, fn) => fn());
		await import("../index");
		expect(discordClient.once).toHaveBeenCalledWith(
			Events.ClientReady,
			expect.any(Function),
		);
		expect(loggerService.info).toHaveBeenCalledWith(logMessages.INFO_BOT_READY);
	});

	it("should login to the discord client", async () => {
		discordClient.user = { tag: "TestUser#1234" } as ClientUser;
		await import("../index");
		expect(discordClient.login).toHaveBeenCalledWith(
			process.env.DISCORD_BOT_TOKEN,
		);
		expect(loggerService.info).toHaveBeenCalledWith(
			logMessages.INFO_BOT_LOGIN,
			discordClient.user?.tag,
		);
	});

	it("should log an error and exit on failure", async () => {
		const error = new Error("Login failed");
		(discordClient.login as Mock).mockRejectedValueOnce(error);
		vi.spyOn(console, "error").mockImplementation(() => {});

		await import("../index");

		expect(console.error).toHaveBeenCalledWith(error);
		expect(exitProcess).toHaveBeenCalledWith(1);
	});

	it("should setup even handlers for SIGINT and SIGTERM", async () => {
		vi.spyOn(process, "on").mockImplementation((_, fn) => fn() as never);

		await import("../index");

		expect(process.on).toHaveBeenCalledWith("SIGINT", expect.any(Function));
		expect(process.on).toHaveBeenCalledWith("SIGTERM", expect.any(Function));
		expect(exitProcess).toHaveBeenCalledTimes(2);
	});
});

vi.mock("../core/services/commands.service");
vi.mock("../core/services/logger.service");
vi.mock("../core/services/scheduler.service");
vi.mock("../core/services/translation.service");
vi.mock("../core/clients/discord.client");
vi.mock("../core/utils/exit-process");
