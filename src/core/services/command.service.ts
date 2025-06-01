import { type CacheType, type Interaction, REST, Routes } from "discord.js";
import { CommandNotFoundError } from "../../shared/errors/command-not-found-error.ts";
import { getEnvironmentVariables } from "../config/get-environment-variables.ts";
import { LogMessages } from "../constants/log-messages.ts";
import {
	type SlashCommand,
	getSlashCommands,
} from "../registries/get-slash-commands.ts";
import { loggerService } from "./logger.service.ts";

class CommandsService {
	private static instance: CommandsService;
	private commands = new Map<string, SlashCommand>();
	private rest: REST;
	private readonly token: string;
	private readonly clientId: string;

	private constructor(token: string, clientId: string) {
		this.token = token;
		this.clientId = clientId;
		this.rest = new REST({ version: "10" }).setToken(this.token);
	}

	/**
	 * Loads commands and registers them with Discord.
	 */
	async initialise() {
		loggerService.debug(LogMessages.DebugInitServiceStart);

		this.loadModules();
		await this.registerCommands();

		loggerService.debug(LogMessages.DebugInitServiceEnd);
	}

	/**
	 * Loads all modules and their commands.
	 */
	private loadModules() {
		loggerService.debug(LogMessages.DebugLoadModulesStart);
		this.commands.clear();

		for (const command of getSlashCommands()) {
			if (this.commands.has(command.data.name)) {
				loggerService.warn(
					LogMessages.WarnCommandAlreadyRegistered,
					command.data.name,
				);
				continue;
			}
			this.commands.set(command.data.name, command);
			loggerService.debug(
				LogMessages.DebugLoadCommandFileEnd,
				command.data.name,
			);
		}

		if (this.commands.size === 0) {
			loggerService.warn(LogMessages.WarnNoCommandsRecognised);
		}
		loggerService.debug(LogMessages.DebugLoadModulesEnd);
	}

	/**
	 * Registers the loaded slash commands with Discord's API.
	 */
	private async registerCommands() {
		try {
			if (getEnvironmentVariables().SKIP_COMMAND_REGISTRATION) {
				loggerService.info(LogMessages.InfoSkipCommandRegistration);
				return;
			}

			loggerService.debug(
				LogMessages.DebugRegisterCommandsStart,
				this.commands.size,
			);

			if (this.commands.size === 0) {
				return;
			}

			const commandsData = this.commands
				.entries()
				.map((cmd) => cmd[1].data.toJSON());

			await this.rest.put(Routes.applicationCommands(this.clientId), {
				body: commandsData,
			});

			loggerService.debug(LogMessages.DebugRegisterCommandsEnd);
		} catch (error) {
			loggerService.error(error, LogMessages.ErrorRegisterCommands);
		}
	}

	/**
	 * Handles incoming interactions and executes the corresponding command.
	 */
	async handleInteraction(interaction: Interaction<CacheType>) {
		if (!interaction.isChatInputCommand()) {
			return;
		}
		const { commandName } = interaction;

		loggerService.debug(LogMessages.DebugHandleInteractionStart, commandName);

		const command = this.commands.get(commandName);

		if (!command) {
			throw new CommandNotFoundError(commandName);
		}

		await command.execute(interaction);
		loggerService.debug(LogMessages.DebugHandleInteractionEnd, commandName);
	}

	/**
	 * Retrieves the instance of the service.
	 */
	public static getInstance(token: string, clientId: string) {
		CommandsService.instance ||= new CommandsService(token, clientId);
		return CommandsService.instance;
	}
}

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } = getEnvironmentVariables();

export const commandService = CommandsService.getInstance(
	DISCORD_BOT_TOKEN,
	DISCORD_CLIENT_ID,
);
