import pino, { type Logger, type LoggerOptions } from "pino";
import environment from "../config/environment";

const IS_PRODUCTION = environment.NODE_ENV === "production";
const IS_DEVELOPMENT_TTY = !IS_PRODUCTION && process.stdout.isTTY;
const PINO_LOG_LEVEL =
	environment.PINO_LOG_LEVEL ?? (IS_PRODUCTION ? "info" : "debug");

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
	public debug: Logger["debug"] = () => {};
	public info: Logger["info"] = () => {};
	public error: Logger["error"] = () => {};
	public warn: Logger["warn"] = () => {};

	private constructor() {}

	public async initialise() {
		const options: LoggerOptions = {
			level: PINO_LOG_LEVEL,
			timestamp: pino.stdTimeFunctions.isoTime,
			...(!IS_PRODUCTION && IS_DEVELOPMENT_TTY ? DEV_OPTIONS : {}),
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

export default LoggerService.getInstance();
