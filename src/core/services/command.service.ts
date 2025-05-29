import { type CacheType, type Interaction, REST, Routes } from "discord.js";
import { CommandNotFoundError } from "../../shared/errors/CommandNotFound";
import getEnvironmentVariables from "../config/get-environment-variables";
import logMessages from "../constants/log-messages";
import getCommands, { type SlashCommand } from "../registries/get-commands";
import LoggerService from "./logger.service";

class CommandsService {
	private static instance: CommandsService;
	private commands = new Map<string, SlashCommand>();
	private rest: REST;

	private constructor(
		private readonly token: string,
		private readonly clientId: string,
	) {
		this.rest = new REST({ version: "10" }).setToken(this.token);
	}

	/**
	 * Loads commands and registers them with Discord.
	 */
	async initialise() {
		LoggerService.debug(logMessages.DEBUG_INIT_SERVICE_START);

		this.loadModules();
		await this.registerCommands();

		LoggerService.debug(logMessages.DEBUG_INIT_SERVICE_END);
	}

	/**
	 * Loads all modules and their commands.
	 */
	private loadModules() {
		LoggerService.debug(logMessages.DEBUG_LOAD_MODULES_START);
		this.commands.clear();

		for (const command of getCommands()) {
			if (this.commands.has(command.data.name)) {
				LoggerService.warn(
					logMessages.WARN_COMMAND_ALREADY_REGISTERED,
					command.data.name,
				);
				continue;
			}
			this.commands.set(command.data.name, command);
			LoggerService.debug(
				logMessages.DEBUG_LOAD_COMMAND_FILE_END,
				command.data.name,
			);
		}

		if (this.commands.size === 0) {
			LoggerService.warn(logMessages.WARN_NO_COMMANDS_RECOGNISED);
		}
		LoggerService.debug(logMessages.DEBUG_LOAD_MODULES_END);
	}

	/**
	 * Registers the loaded slash commands with Discord's API.
	 */
	private async registerCommands() {
		try {
			if (getEnvironmentVariables().SKIP_COMMAND_REGISTRATION) {
				LoggerService.info(logMessages.INFO_SKIP_COMMAND_REGISTRATION);
				return;
			}

			LoggerService.debug(
				logMessages.DEBUG_REGISTER_COMMANDS_START,
				this.commands.size,
			);
			if (this.commands.size === 0) return;

			const commandsData = this.commands
				.entries()
				.map((cmd) => cmd[1].data.toJSON());

			await this.rest.put(Routes.applicationCommands(this.clientId), {
				body: commandsData,
			});

			LoggerService.debug(logMessages.DEBUG_REGISTER_COMMANDS_END);
		} catch (error) {
			LoggerService.error(error, logMessages.ERROR_REGISTER_COMMANDS);
		}
	}

	/**
	 * Handles incoming interactions and executes the corresponding command.
	 */
	async handleInteraction(interaction: Interaction<CacheType>) {
		if (!interaction.isChatInputCommand()) return;
		const { commandName } = interaction;

		LoggerService.debug(
			logMessages.DEBUG_HANDLE_INTERACTION_START,
			commandName,
		);

		const command = this.commands.get(commandName);

		if (!command) throw new CommandNotFoundError(commandName);

		await command.execute(interaction);
		LoggerService.debug(logMessages.DEBUG_HANDLE_INTERACTION_END, commandName);
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

export default CommandsService.getInstance(
	DISCORD_BOT_TOKEN,
	DISCORD_CLIENT_ID,
);
