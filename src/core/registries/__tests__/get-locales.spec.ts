import { afterEach, describe, expect, it, vi } from "vitest";

describe("locales.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});

	it("should export an object with locales", async () => {
		const { default: getLocales } = await import("../get-locales");
		expect(getLocales()).toBeInstanceOf(Object);
		expect(getLocales()).toHaveProperty("en");
	});

	it("should export locales with the correct translations", async () => {
		const { default: getLocales } = await import("../get-locales");
		expect(getLocales().en).toBeInstanceOf(Object);
		expect(getLocales().en).toHaveProperty("availability");
		expect(getLocales().en).toHaveProperty("config");
	});
});
