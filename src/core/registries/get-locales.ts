import availability from "../../modules/availability/locales/en/availability.json";
import config from "../../modules/config/locales/en/config.json";

const locales = {
	en: {
		availability,
		config,
	},
};

export function getLocales() {
	return locales;
}
