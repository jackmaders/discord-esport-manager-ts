import { Client } from "discord.js";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("discord.client.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});
	it("should initialise the Discord client", async () => {
		expect((await import("../discord.client")).default).toBeInstanceOf(Client);
	});
});
