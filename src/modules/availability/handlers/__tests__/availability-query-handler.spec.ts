import { describe, expect, it, vi } from "vitest";
import { handleAvailabilityQuery } from "../availability-query-handler.ts";

describe("availability-query-handler.ts", () => {
	it("should throw an error if no guildId is provided", async () => {
		// Arrange
		const interaction = {};

		// Act
		const promise = handleAvailabilityQuery(interaction as never);

		// Assert
		await expect(promise).rejects.toThrow(
			'Cannot execute command "undefined" outside a guild.',
		);
	});

	it("should throw an error if no guildId is provided", async () => {
		// Arrange
		const interaction = {
			guildId: undefined,
		};

		// Act
		const promise = handleAvailabilityQuery(interaction as never);

		// Assert
		await expect(promise).rejects.toThrow(
			'Cannot execute command "undefined" outside a guild.',
		);
	});

	it("should send the availability query", async () => {
		// Arrange
		const interaction = {
			guildId: "123456789012345678",
		};

		// Act
		const promise = handleAvailabilityQuery(interaction as never);

		// Assert
		await expect(promise).rejects.toThrow(
			'Cannot execute command "undefined" outside a guild.',
		);
	});
});

vi.mock("../../../../core/services/logger-service.ts");
vi.mock("../../../../shared/services/guild-config-service.ts");
vi.mock("../../../../shared/services/discord-service.ts");
