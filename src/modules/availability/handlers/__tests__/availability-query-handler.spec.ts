import { describe, expect, it, vi } from "vitest";
import { guildConfigService } from "../../../../shared/services/guild-config-service.ts";
import { sendAvailabilityPoll } from "../../ui/availability-poll.ts";
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

	it("should send the availability query to the pre-defined channel", async () => {
		// Arrange
		vi.mocked(guildConfigService).getAvailabilityChannelId.mockResolvedValue(
			"67890",
		);

		const interaction = {
			guildId: "12345",
			reply: vi.fn(),
		};

		// Act
		await handleAvailabilityQuery(interaction as never);

		// Assert
		expect(sendAvailabilityPoll).toHaveBeenCalledWith(
			undefined,
			interaction.guildId,
		);
		expect(interaction.reply).toHaveBeenCalledWith({
			content: undefined,
			flags: [64],
		});
	});

	it("should send the availability query if the channel is unset", async () => {
		vi.mocked(guildConfigService).getAvailabilityChannelId.mockResolvedValue(
			null,
		);
		// Arrange
		const interaction = {
			guildId: "123456789012345678",
			reply: vi.fn(),
		};

		// Act
		await handleAvailabilityQuery(interaction as never);

		// Assert
		expect(sendAvailabilityPoll).toHaveBeenCalled();
	});
});

vi.mock("../../ui/availability-poll.ts");
vi.mock("../../../../core/services/logger-service.ts");
vi.mock("../../../../shared/services/guild-config-service.ts");
vi.mock("../../../../shared/services/discord-service.ts");
