import { afterEach, describe, expect, it, vi } from "vitest";

describe("commands.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});

	it("should export an array of commands", async () => {
		const { getSlashCommands: getCommands } = await import(
			"../get-slash-commands.ts"
		);
		expect(getCommands()).toBeInstanceOf(Array);
	});

	it("should export commands with data and execute properties", async () => {
		const { getSlashCommands: getCommands } = await import(
			"../get-slash-commands.ts"
		);
		for (const command of getCommands()) {
			expect(command).toHaveProperty("data");
			expect(typeof command.data).toBe("object");
			expect(command).toHaveProperty("execute");
			expect(typeof command.execute).toBe("function");
		}
	});
});

vi.mock("../../services/logger.service.ts");
vi.mock("../../../modules/availability/commands/availability-command.ts");
vi.mock("../../../modules/config/commands/config-command.ts");
