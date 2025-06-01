import { afterEach, describe, expect, it, vi } from "vitest";
import { LogMessages } from "../../constants/log-messages.ts";

describe("command-service.ts", () => {
	afterEach(() => {
		vi.resetModules();
		vi.unstubAllEnvs();
	});

	it("should export a CommandService instance", async () => {
		// Act
		const { commandService } = await import("../command-service.ts");

		// Assert
		expect(commandService).toBeDefined();
		expect(typeof commandService).toBe("object");
	});

	it("should return the same instance when imported twice", async () => {
		// Act
		const commandService1 = (await import("../command-service.ts"))
			.commandService;
		const commandService2 = (await import("../command-service.ts"))
			.commandService;

		// Assert
		expect(commandService1).toBe(commandService2);
	});

	it("should initialise REST client on import", async () => {
		// Arrange
		const { REST } = await import("discord.js");

		// Act
		await import("../command-service.ts");

		// Assert
		expect(REST).toHaveBeenCalledWith({ version: "10" });
	});

	it("should return a warning if no modules are loaded", async () => {
		// Arrange
		const { loggerService } = await import("../logger-service.ts");
		const { getSlashCommands: getCommands } = await import(
			"../../registries/get-slash-commands.ts"
		);
		vi.mocked(getCommands).mockReturnValue([]);

		// Act
		const { commandService } = await import("../command-service.ts");
		await commandService.initialise();

		// Assert
		expect(loggerService.warn).toHaveBeenCalledWith(
			LogMessages.WarnNoCommandsRecognised,
		);
	});

	it("should load modules on initialisation", async () => {
		// Arrange
		const { loggerService } = await import("../logger-service.ts");
		const { getSlashCommands: getCommands } = await import(
			"../../registries/get-slash-commands.ts"
		);

		// Act
		const { commandService } = await import("../command-service.ts");
		await commandService.initialise();

		// Assert
		expect(loggerService.debug).toHaveBeenCalledWith(
			LogMessages.DebugLoadCommandFileEnd,
			getCommands()[0].data.name,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			LogMessages.DebugLoadCommandFileEnd,
			getCommands()[1].data.name,
		);
	});

	it("should return a warning if duplicate modules are loaded", async () => {
		// Arrange
		const { loggerService } = await import("../logger-service.ts");
		const { getSlashCommands } = await import(
			"../../registries/get-slash-commands.ts"
		);
		vi.mocked(getSlashCommands).mockReturnValue([
			getSlashCommands()[0],
			getSlashCommands()[0],
		]);

		// Act
		const { commandService } = await import("../command-service.ts");
		await commandService.initialise();

		// Assert
		expect(loggerService.warn).toHaveBeenCalledWith(
			LogMessages.WarnCommandAlreadyRegistered,
			getSlashCommands()[0].data.name,
		);
	});

	it("should register commands on initialisation", async () => {
		// Arrange
		const { loggerService } = await import("../logger-service.ts");

		// Act
		const { commandService } = await import("../command-service.ts");
		await commandService.initialise();

		// Assert
		expect(loggerService.debug).toHaveBeenCalledWith(
			LogMessages.DebugRegisterCommandsStart,
			2,
		);
		expect(loggerService.debug).toHaveBeenCalledWith(
			LogMessages.DebugRegisterCommandsEnd,
		);
	});

	it("should skip command registration if SKIP_COMMAND_REGISTRATION is true", async () => {
		// Arrange
		vi.stubEnv("SKIP_COMMAND_REGISTRATION", "true");
		const { loggerService } = await import("../logger-service.ts");

		// Act
		const { commandService } = await import("../command-service.ts");
		await commandService.initialise();

		// Assert
		expect(loggerService.info).toHaveBeenCalledWith(
			LogMessages.InfoSkipCommandRegistration,
		);
		expect(loggerService.debug).not.toHaveBeenCalledWith(
			LogMessages.DebugRegisterCommandsStart,
			2,
		);
	});

	it("should return an error if the commands cannot be registered", async () => {
		// Arrange
		const { REST } = await import("discord.js");
		const error = new Error("API Error");
		vi.mocked(REST).mockReturnValue({
			setToken: vi.fn().mockReturnThis(),
			put: vi.fn().mockRejectedValue(error),
		} as never);
		const { loggerService } = await import("../logger-service.ts");

		// Act
		const { commandService } = await import("../command-service.ts");
		await commandService.initialise();

		// Assert
		expect(loggerService.error).toHaveBeenCalledWith(
			error,
			LogMessages.ErrorRegisterCommands,
		);
	});

	it("should handle an valid interaction", async () => {
		// Arrange
		const { getSlashCommands: getCommands } = await import(
			"../../registries/get-slash-commands.ts"
		);

		// Act
		const { commandService } = await import("../command-service.ts");
		await commandService.initialise();
		commandService.handleInteraction({
			commandName: getCommands()[0].data.name,
			isChatInputCommand: () => true,
		} as never);

		// Assert
		expect(getCommands()[0].execute).toHaveBeenCalled();
	});

	it("should handle an non chat-input interaction", async () => {
		// Arrange
		const { getSlashCommands: getCommands } = await import(
			"../../registries/get-slash-commands.ts"
		);

		// Act
		const { commandService } = await import("../command-service.ts");
		await commandService.initialise();
		const result = await commandService.handleInteraction({
			commandName: getCommands()[0].data.name,
			isChatInputCommand: () => false,
		} as never);

		// Assert
		expect(getCommands()[0].execute).not.toHaveBeenCalled();
		expect(result).toBe(undefined);
	});

	it("should handle an interaction with an unknown name", async () => {
		// Arrange
		const { getSlashCommands: getCommands } = await import(
			"../../registries/get-slash-commands.ts"
		);

		// Act
		const { commandService } = await import("../command-service.ts");
		await commandService.initialise();
		const promise = commandService.handleInteraction({
			commandName: "asdf",
			isChatInputCommand: () => true,
		} as never);

		// Assert
		expect(getCommands()[0].execute).not.toHaveBeenCalled();
		await expect(promise).rejects.toThrow("asdf");
	});
});

vi.mock("discord.js");
vi.mock("../logger-service.ts");
vi.mock("../../registries/get-slash-commands.ts");
vi.mock("../../config/get-environment-variables.ts");
