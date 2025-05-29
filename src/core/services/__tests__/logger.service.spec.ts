import { afterEach, describe, expect, it, vi } from "vitest";

describe("logger.service.ts", () => {
	afterEach(() => {
		vi.resetModules();
		vi.unstubAllEnvs();
	});

	it("should export a LoggerService instance", async () => {
		// Act
		const loggerService = (await import("../logger.service")).default;

		// Assert
		expect(loggerService).toBeDefined();
		expect(typeof loggerService).toBe("object");
	});

	it("should handle if logging methods are called before initialisation", async () => {
		// Arrange
		vi.spyOn(console, "debug").mockImplementation(vi.fn());
		vi.spyOn(console, "info").mockImplementation(vi.fn());
		vi.spyOn(console, "warn").mockImplementation(vi.fn());
		vi.spyOn(console, "error").mockImplementation(vi.fn());
		const loggerService = (await import("../logger.service")).default;

		// Act
		loggerService.debug("debug");
		loggerService.info("info");
		loggerService.warn("warn");
		loggerService.error("error");

		// Assert
		expect(console.debug).toHaveBeenCalledWith("debug");
		expect(console.info).toHaveBeenCalledWith("info");
		expect(console.warn).toHaveBeenCalledWith("warn");
		expect(console.error).toHaveBeenCalledWith("error");
	});

	it("should correctly initialise the service with production options", async () => {
		// Arrange
		vi.stubEnv("NODE_ENV", "production");
		const pino = (await import("pino")).default;
		const loggerService = (await import("../logger.service")).default;

		// Act
		await loggerService.initialise();
		loggerService.debug("debug");
		loggerService.info("info");
		loggerService.warn("warn");
		loggerService.error("error");

		// Assert
		expect(pino).toHaveBeenCalledWith({
			level: "info",
			timestamp: pino.stdTimeFunctions.isoTime,
		});
		expect(pino().debug).toHaveBeenCalledWith("debug");
		expect(pino().info).toHaveBeenCalledWith("info");
		expect(pino().warn).toHaveBeenCalledWith("warn");
		expect(pino().error).toHaveBeenCalledWith("error");
	});

	it("should correctly initialise the service with development options", async () => {
		// Arrange
		vi.stubEnv("NODE_ENV", "development");
		const pino = (await import("pino")).default;
		const loggerService = (await import("../logger.service")).default;

		// Act
		await loggerService.initialise();
		loggerService.debug("debug");
		loggerService.info("info");
		loggerService.warn("warn");
		loggerService.error("error");

		// Assert
		expect(pino).toHaveBeenCalledWith({
			level: "info",
			timestamp: pino.stdTimeFunctions.isoTime,
			transport: {
				options: {
					colorize: true,
					ignore: "pid,hostname",
					translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
				},
				target: "pino-pretty",
			},
		});
		expect(pino().debug).toHaveBeenCalledWith("debug");
		expect(pino().info).toHaveBeenCalledWith("info");
		expect(pino().warn).toHaveBeenCalledWith("warn");
		expect(pino().error).toHaveBeenCalledWith("error");
	});
});

vi.mock("pino");
