import { Client } from "discord.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { loggerService } from "../../services/logger-service.ts";
import { DiscordClientLogs } from "../logs/discord-client.logs.ts";

describe("discord-client.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});
	it("should initialise the Discord client", async () => {
		const { discordClient } = await import("../discord-client.ts");

		expect(discordClient).toBeInstanceOf(Client);
		expect(loggerService.info).toHaveBeenCalledWith(
			DiscordClientLogs.DiscordClientInit,
		);
	});
});

vi.mock("discord.js");
vi.mock("../../services/logger-service.ts");
