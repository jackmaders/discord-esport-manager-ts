import { init } from "i18next";
import { getLocales } from "../registries/get-locales.ts";

class TranslationService {
	private static instance: TranslationService;

	private constructor() {}

	async initialise() {
		const locales = getLocales();

		await init({
			resources: locales,
			lng: "en",
			fallbackLng: "en",
			ns: Object.keys(locales.en),
			// biome-ignore lint/style/useNamingConvention: i18next uses double capitalisation
			defaultNS: "common",
			interpolation: {
				escapeValue: false,
			},
		});
	}

	public static getInstance() {
		if (!TranslationService.instance) {
			TranslationService.instance = new TranslationService();
		}
		return TranslationService.instance;
	}
}

export const translationService = TranslationService.getInstance();
