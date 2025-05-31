import pino, { type Logger, type LoggerOptions } from "pino";
import { getEnvironmentVariables } from "../config/get-environment-variables.ts";

const DEV_OPTIONS: Partial<LoggerOptions> = {
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
			ignore: "pid,hostname",
		},
	},
};

class LoggerService {
	private static instance: LoggerService;
	public initialised = false;
	private logger: Logger = pino();
	public debug: Logger["debug"] = console.debug;
	public info: Logger["info"] = console.info;
	public error: Logger["error"] = console.error;
	public warn: Logger["warn"] = console.warn;
	private constructor() {}

	public initialise() {
		const { NODE_ENV, PINO_LOG_LEVEL } = getEnvironmentVariables();

		const isProduction = NODE_ENV === "production";

		const options: LoggerOptions = {
			level: PINO_LOG_LEVEL,
			timestamp: pino.stdTimeFunctions.isoTime,
			...(isProduction ? {} : DEV_OPTIONS),
		};

		this.logger = pino(options);

		this.debug = this.logger.debug.bind(this.logger);
		this.info = this.logger.info.bind(this.logger);
		this.error = this.logger.error.bind(this.logger);
		this.warn = this.logger.warn.bind(this.logger);

		this.initialised = true;
	}

	public static getInstance(): LoggerService {
		LoggerService.instance ||= new LoggerService();
		return LoggerService.instance;
	}
}

export const loggerService = LoggerService.getInstance();
