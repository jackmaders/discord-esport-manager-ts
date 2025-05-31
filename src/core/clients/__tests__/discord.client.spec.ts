import { Client } from "discord.js";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("discord.client.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});
	it("should initialise the Discord client", async () => {
		const { discordClient } = await import("../discord.client.ts");

		expect(discordClient).toBeInstanceOf(Client);
	});
});
