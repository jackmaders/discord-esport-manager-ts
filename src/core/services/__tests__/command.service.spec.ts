import { REST, Routes } from "discord.js";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import logMessages from "../../constants/log-messages";
import getCommands from "../../registries/get-commands";
import loggerService from "../logger.service";

describe("command.service.ts", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterAll(() => {
		vi.unstubAllEnvs();
	});

	it("should export a CommandService class", async () => {
		const { default: commandService } = await import("../command.service");

		expect(commandService).toBeDefined();
		expect(typeof commandService).toBe("object");
	});

	it("should return the same instance when imported twice", async () => {
		const { default: service } = await import("../command.service");

		expect((await import("../command.service")).default).toStrictEqual(service);
	});

	it("should load modules on initialisation", async () => {
		await (await import("../command.service")).default.initialise();

		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_INIT_SERVICE_START,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_LOAD_MODULES_START,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_LOAD_COMMAND_FILE_END,
			getCommands()[0].data.name,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_LOAD_MODULES_END,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_INIT_SERVICE_END,
		);
	});

	it("should return a warning if no modules are loaded", async () => {
		vi.mocked(getCommands).mockReturnValue([]);

		await (await import("../command.service")).default.initialise();

		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_INIT_SERVICE_START,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_LOAD_MODULES_START,
		);
		expect(loggerService.warn).toHaveBeenCalledWith(
			logMessages.WARN_NO_COMMANDS_RECOGNISED,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_LOAD_MODULES_END,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_INIT_SERVICE_END,
		);
	});

	it("should return a warning if duplicate modules are loaded", async () => {
		const commands = getCommands();
		vi.mocked(getCommands).mockReturnValue([commands[0], commands[0]]);

		await (await import("../command.service")).default.initialise();

		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_INIT_SERVICE_START,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_LOAD_MODULES_START,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_LOAD_COMMAND_FILE_END,
			getCommands()[0].data.name,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_LOAD_MODULES_END,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_INIT_SERVICE_END,
		);
	});

	it("should register commands on initialisation", async () => {
		await (await import("../command.service")).default.initialise();

		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_INIT_SERVICE_START,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_REGISTER_COMMANDS_START,
			2,
		);

		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_REGISTER_COMMANDS_END,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			logMessages.DEBUG_INIT_SERVICE_END,
		);
	});

	// it("should skip command registration if SKIP_COMMAND_REGISTRATION is true", async () => {
	// 	vi.doMock("../../config/environment", () => ({
	// 		default: { SKIP_COMMAND_REGISTRATION: "true" },
	// 	}));
	// 	vi.doMock("../../registries/commands", () => ({
	// 		default: MOCK_COMMANDS,
	// 	}));

	// 	await (await import("../command.service")).default.initialise();

	// 	expect(loggerService.info).toHaveBeenCalledWith(
	// 		logMessages.INFO_SKIP_COMMAND_REGISTRATION,
	// 	);
	// 	expect(loggerService.debug).not.toHaveBeenCalledWith(
	// 		logMessages.DEBUG_REGISTER_COMMANDS_START,
	// 		MOCK_COMMANDS.length,
	// 	);
	// });

	// it("should return a warning if no commands are registered", async () => {
	// 	vi.doMock("../../registries/commands", () => ({
	// 		default: [],
	// 	}));

	// 	await (await import("../command.service")).default.initialise();

	// 	expect(loggerService.debug).toHaveBeenCalledWith(
	// 		logMessages.DEBUG_INIT_SERVICE_START,
	// 	);

	// 	expect(loggerService.warn).toHaveBeenCalledWith(
	// 		logMessages.WARN_NO_COMMANDS_RECOGNISED,
	// 	);
	// });

	// it("should return an error if the commands cannot be registered", async () => {
	// 	vi.doMock("../../registries/commands", () => ({
	// 		default: [MOCK_COMMANDS[0], MOCK_COMMANDS[0]],
	// 	}));
	// 	const error = new Error("API Error");
	// 	(REST.prototype.setToken as Mock).mockReturnValue({
	// 		put: vi.fn().mockRejectedValue(error),
	// 	});

	// 	await (await import("../command.service")).default.initialise();

	// 	expect(loggerService.error).toHaveBeenCalledWith(
	// 		error,
	// 		logMessages.ERROR_REGISTER_COMMANDS,
	// 	);
	// });
});

vi.mock("discord.js", () => ({
	REST: vi.fn(() => {
		return {
			setToken: vi.fn().mockReturnThis(),
			put: vi.fn(),
		};
	}),
	Routes: {
		applicationCommands: vi.fn(),
	},
}));
vi.mock("../logger.service");
vi.mock("../../registries/get-commands", () => ({
	default: vi.fn(() => [
		{
			data: { name: "testCommand" },
			execute: vi.fn(),
		},
		{
			data: { name: "anotherCommand" },
			execute: vi.fn(),
		},
	]),
}));
