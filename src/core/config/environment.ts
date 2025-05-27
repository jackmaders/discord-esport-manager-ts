import { z } from "zod/v4";

const schema = z.object({
	DISCORD_BOT_TOKEN: z.string(),
	DISCORD_CLIENT_ID: z.string(),
	PRISMA_DATABASE_URL: z.url(),
	NODE_ENV: z.string().default("production"),
	PINO_LOG_LEVEL: z
		.enum(["trace", "debug", "info", "warn", "error", "fatal"])
		.default("info"),
	SKIP_COMMAND_REGISTRATION: z.preprocess(
		(val) => String(val).toLowerCase() === "true",
		z.boolean().default(false),
	),
});

const environment = schema.parse(process.env);

export default environment;
