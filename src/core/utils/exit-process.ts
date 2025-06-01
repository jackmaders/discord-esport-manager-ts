import { prismaClient } from "../../shared/clients/prisma.ts";
import { discordClient } from "../clients/discord-client.ts";
import { loggerService } from "../services/logger-service.ts";

let isExiting = false;

export async function exitProcess(exitCode = 0) {
	if (isExiting) {
		return null;
	}

	isExiting = true;

	try {
		await prismaClient.$disconnect();
	} catch (error) {
		loggerService.error("Error during Prisma client disconnection:", error);
	}

	try {
		await discordClient.destroy();
	} catch (error) {
		loggerService.error("Error during Discord client destruction:", error);
	}

	process.exit(exitCode);
}
