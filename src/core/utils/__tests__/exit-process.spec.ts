import { beforeEach, describe, expect, it, vi } from "vitest";

describe("exit-process.ts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetModules();
		vi.spyOn(process, "exit").mockImplementation(() => ({}) as never);
	});

	it("should disconnect from the clients", async () => {
		// Arrange
		const { prismaClient } = await import("../../../shared/clients/prisma.ts");
		const { discordClient } = await import("../../clients/discord-client.ts");
		const { exitProcess } = await import("../exit-process.ts");

		// Act
		await exitProcess();

		// Assert
		expect(prismaClient.$disconnect).toHaveBeenCalled();
		expect(discordClient.destroy).toHaveBeenCalled();
		expect(process.exit).toHaveBeenCalledWith(0);
	});

	it("should return null if already exiting", async () => {
		// Arrange
		const { exitProcess } = await import("../exit-process.ts");

		// Act
		const [result1, result2] = await Promise.all([
			exitProcess(),
			exitProcess(),
		]);

		// Assert
		expect(result1).toBeUndefined();
		expect(result2).toBeNull();
	});

	it("should log an error and destroy discord client if prisma errors", async () => {
		// Arrange
		const { loggerService } = await import("../../services/logger.service.ts");
		const { prismaClient } = await import("../../../shared/clients/prisma.ts");
		const { discordClient } = await import("../../clients/discord-client.ts");
		const { exitProcess } = await import("../exit-process.ts");
		const error = new Error("Prisma disconnect error");
		vi.mocked(prismaClient).$disconnect.mockRejectedValue(error);

		// Act
		await exitProcess();

		// Assert
		expect(loggerService.error).toHaveBeenCalledWith(
			"Error during Prisma client disconnection:",
			error,
		);
		expect(discordClient.destroy).toHaveBeenCalled();
		expect(process.exit).toHaveBeenCalledWith(0);
	});

	it("should log an error and disconnect prisma client if discord errors", async () => {
		// Arrange
		const { loggerService } = await import("../../services/logger.service.ts");
		const { prismaClient } = await import("../../../shared/clients/prisma.ts");
		const { discordClient } = await import("../../clients/discord-client.ts");
		const { exitProcess } = await import("../exit-process.ts");
		const error = new Error("Discord disconnect error");
		vi.mocked(discordClient).destroy.mockRejectedValue(error);

		// Act
		await exitProcess();

		// Assert
		expect(loggerService.error).toHaveBeenCalledWith(
			"Error during Discord client destruction:",
			error,
		);
		expect(prismaClient.$disconnect).toHaveBeenCalled();
		expect(process.exit).toHaveBeenCalledWith(0);
	});
});

vi.mock("../../../shared/clients/prisma.ts");
vi.mock("../../clients/discord-client.ts");
vi.mock("../../services/logger.service.ts");
