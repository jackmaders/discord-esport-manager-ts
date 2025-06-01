import { z } from "zod/v4";
import { loggerService } from "../services/logger-service.ts";
import { GetEnvironmentVariablesLogs } from "./logs/get-environment-variables.logs.ts";

export function getEnvironmentVariables() {
	loggerService.debug(GetEnvironmentVariablesLogs.Start);

	const schema = z.object({
		// biome-ignore lint/style/useNamingConvention: environment variables
		DISCORD_BOT_TOKEN: z.string(),
		// biome-ignore lint/style/useNamingConvention: environment variables
		DISCORD_CLIENT_ID: z.string(),
		// biome-ignore lint/style/useNamingConvention: environment variables
		PRISMA_DATABASE_URL: z.url(),
		// biome-ignore lint/style/useNamingConvention: environment variables
		NODE_ENV: z.string().default("production"),
		// biome-ignore lint/style/useNamingConvention: environment variables
		PINO_LOG_LEVEL: z
			.enum(["trace", "debug", "info", "warn", "error", "fatal"])
			.default("info"),
		// biome-ignore lint/style/useNamingConvention: environment variables
		SKIP_COMMAND_REGISTRATION: z.preprocess(
			(val) => String(val).toLowerCase() === "true",
			z.boolean().default(false),
		),
	});

	return schema.parse(process.env);
}
