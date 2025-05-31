import { afterEach, describe, expect, it, vi } from "vitest";

describe("schedules.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});

	it("should export an array of commands", async () => {
		const { getSchedules } = await import("../get-schedules.ts");
		expect(getSchedules()).toBeInstanceOf(Array);
	});

	it("should export commands with data and execute properties", async () => {
		const { getSchedules } = await import("../get-schedules.ts");
		for (const schedule of getSchedules()) {
			expect(schedule).toHaveProperty("name");
			expect(typeof schedule.name).toBe("string");
			expect(schedule).toHaveProperty("pattern");
			expect(typeof schedule.pattern).toBeOneOf(["string", "object"]);
			expect(schedule).toHaveProperty("execute");
			expect(typeof schedule.execute).toBe("function");
		}
	});
});
