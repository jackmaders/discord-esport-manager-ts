import { afterEach, describe, expect, it, vi } from "vitest";

describe("translation-service.ts", () => {
	afterEach(() => {
		vi.resetModules();
		vi.unstubAllEnvs();
	});

	it("should export a TranslationService instance", async () => {
		// Act
		const { translationService } = await import("../translation-service.ts");

		// Assert
		expect(translationService).toBeDefined();
		expect(typeof translationService).toBe("object");
	});

	it("should return the same instance when imported twice", async () => {
		// Act
		const { translationService: service1 } = await import(
			"../translation-service.ts"
		);
		const { translationService: service2 } = await import(
			"../translation-service.ts"
		);

		// Assert
		expect(service1).toBe(service2);
	});

	it("should correctly initialise the service", async () => {
		// Arrange
		const { init } = await import("i18next");
		const { getLocales } = await import("../../registries/get-locales.ts");
		const { translationService } = await import("../translation-service.ts");

		// Act
		await translationService.initialise();

		// Assert
		expect(getLocales).toHaveBeenCalled();
		expect(init).toHaveBeenCalledWith({
			// biome-ignore lint/style/useNamingConvention: i18next uses double capitalisation
			defaultNS: "common",
			fallbackLng: "en",
			interpolation: {
				escapeValue: false,
			},
			lng: "en",
			ns: Object.keys(getLocales().en),
			resources: getLocales(),
		});
	});
});

vi.mock("i18next");
vi.mock("../../registries/get-locales");
