import { init } from "i18next";
import locales from "../registries/locales";

class TranslationService {
	private static instance: TranslationService;

	private constructor() {}

	async initialise() {
		await init({
			resources: locales,
			lng: "en",
			fallbackLng: "en",
			ns: Object.keys(locales.en),
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

export default TranslationService.getInstance();
