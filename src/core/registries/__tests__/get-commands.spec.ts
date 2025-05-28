import { afterEach, describe, expect, it, vi } from "vitest";

describe("commands.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});

	it("should export an array of commands", async () => {
		const { default: getCommands } = await import("../get-commands");
		expect(getCommands()).toBeInstanceOf(Array);
	});

	it("should export commands with data and execute properties", async () => {
		const { default: getCommands } = await import("../get-commands");
		for (const command of getCommands()) {
			expect(command).toHaveProperty("data");
			expect(typeof command.data).toBe("object");
			expect(command).toHaveProperty("execute");
			expect(typeof command.execute).toBe("function");
		}
	});
});
