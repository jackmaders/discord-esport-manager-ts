import pino, { type LoggerOptions } from "pino";
import LogMessages from "./constants/LogMessages";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopmentTTY = !isProduction && process.stdout.isTTY;
const logLevel = process.env.LOG_LEVEL || (isProduction ? "info" : "debug");

// Set development options for pino-pretty output
const developmentOptions: Partial<LoggerOptions> = {
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
			ignore: "pid,hostname",
		},
	},
};

const loggerOptions: LoggerOptions = {
	level: logLevel,
	timestamp: pino.stdTimeFunctions.isoTime,
	...(isDevelopmentTTY && developmentOptions),
};

const logger = pino(loggerOptions);

logger.debug(LogMessages.DEBUG_LOGGER_INIT, logLevel);

export default logger;
