import prismaClient from "../../shared/clients/prisma.ts";
import discordClient from "../clients/discord.client.ts";
import logMessages from "../constants/log-messages.ts";
import loggerService from "../services/logger.service.ts";

function exitProcess(exitCode = 0) {
	try {
		loggerService.info(logMessages.INFO_BOT_SHUTDOWN);
	} catch (error) {
		console.error(error);
	} finally {
		prismaClient.$disconnect();
		discordClient.destroy();
		process.exit(exitCode);
	}
}

export default exitProcess;
