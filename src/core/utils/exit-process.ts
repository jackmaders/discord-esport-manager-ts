import { prismaClient } from "../../shared/clients/prisma.ts";
import { discordClient } from "../clients/discord.client.ts";
import { LogMessages } from "../constants/log-messages.ts";
import { loggerService } from "../services/logger.service.ts";

export function exitProcess(exitCode = 0) {
	try {
		loggerService.info(LogMessages.InfoBotShutdown);
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: fallback for logging errors
		console.error(error);
	} finally {
		prismaClient.$disconnect();
		discordClient.destroy();
		process.exit(exitCode);
	}
}
