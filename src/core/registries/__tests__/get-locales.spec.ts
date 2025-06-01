import { afterEach, describe, expect, it, vi } from "vitest";

describe("locales.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});

	it("should export an object with locales", async () => {
		const { getLocales } = await import("../get-locales.ts");
		expect(getLocales()).toBeInstanceOf(Object);
		expect(getLocales()).toHaveProperty("en");
	});

	it("should export locales with the correct translations", async () => {
		const { getLocales } = await import("../get-locales.ts");
		expect(getLocales().en).toBeInstanceOf(Object);
		expect(getLocales().en).toHaveProperty("availability");
		expect(getLocales().en).toHaveProperty("config");
	});
});

vi.mock("../../services/logger-service.ts");
