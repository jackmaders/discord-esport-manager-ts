import pino, { type LoggerOptions } from "pino";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopmentTTY = !isProduction && process.stdout.isTTY;
const logLevel = process.env.LOG_LEVEL || (isProduction ? "info" : "debug");

const loggerOptions: LoggerOptions = {
	level: logLevel,
	base: {
		pid: process.pid,
	},
	timestamp: pino.stdTimeFunctions.isoTime,
	...(isDevelopmentTTY && {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
				translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
				ignore: "pid,hostname",
			},
		},
	}),
};

const logger = pino(loggerOptions);

logger.info(`Logger initialized with level "${logLevel}"`);

export default logger;
