import availability from "../../modules/availability/locales/en/availability.json";
import config from "../../modules/config/locales/en/config.json";
import { loggerService } from "../services/logger.service.ts";
import { GetLocalesLogs } from "./logs/get-locales.logs.ts";

const locales = {
	en: {
		availability,
		config,
	},
};

export function getLocales() {
	loggerService.debug(GetLocalesLogs.Start);
	return locales;
}
