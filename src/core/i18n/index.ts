import { init } from "i18next";
import logger from "../logger";

import commonEn from "../../locales/en/common.json";
import pingEn from "../../locales/en/modules/ping/ping-handler.json";
import logMessages from "../logger/messages";

const resources = {
	en: {
		common: commonEn,
		ping: pingEn,
	},
};

/**
 * Initializes i18next with the provided resources and configuration.
 */

export default async function initI18n() {
	await init({
		resources,
		lng: "en",
		fallbackLng: "en",
		ns: Object.keys(resources.en),
		defaultNS: "common",
		interpolation: {
			escapeValue: false,
		},
	});
	logger.debug(logMessages.DEBUG_I18N_INIT);
}
