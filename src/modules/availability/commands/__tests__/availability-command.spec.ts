import type { SlashCommandSubcommandBuilder } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { handleAvailabilityQuery } from "../../handlers/availability-query-handler.ts";
import { availabilityCommand } from "../availability-command.ts";

describe("availability-command.spec.ts", () => {
	it("should export a data and execute property", () => {
		// Assert
		expect(availabilityCommand).toHaveProperty("data");
		expect(availabilityCommand).toHaveProperty("execute");
	});

	it("should correctly setup the parent command", () => {
		// Arrange
		const { data: commandData } = availabilityCommand;

		// Assert
		expect(commandData.name).toBe("availability");
		expect(commandData.description).toBe("Manage the availability of a team");
		expect(commandData.default_member_permissions).toEqual("4");
		expect(commandData.integration_types).toEqual([0]);
		expect(commandData.contexts).toEqual([0]);
		expect(commandData.options).toHaveLength(1);
	});

	it("should correctly setup the query subcommand", () => {
		// Arrange
		const subcommand = availabilityCommand.data
			.options[0] as SlashCommandSubcommandBuilder;

		// Assert
		expect(subcommand.name).toBe("query");
		expect(subcommand.description).toBe(
			"Submit a poll to check the availability of the team",
		);
		expect(subcommand.options).toHaveLength(0);
	});

	it("should call handleAvailabilityQuery if availability is passed", async () => {
		// Arrange
		const { execute } = availabilityCommand;

		const interaction = {
			options: {
				getSubcommand: () => "query",
			},
		};

		// Act
		await execute(interaction as never);

		// Assert
		expect(handleAvailabilityQuery).toHaveBeenCalledWith(interaction as never);
	});

	it("should throw a CommandNotFoundError error if an invalid command is provided", async () => {
		// Arrange
		const { execute } = availabilityCommand;

		const interaction = {
			options: {
				getSubcommand: () => "invalid",
			},
		};

		// Act
		const promise = execute(interaction as never);

		// Assert
		await expect(promise).rejects.toThrow("Command '/invalid' not found.");
	});
});

vi.mock("../../../../core/services/logger-service.ts");
vi.mock("../../handlers/availability-query-handler.ts");
