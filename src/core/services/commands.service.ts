import {
	type CacheType,
	Collection,
	type Interaction,
	REST,
	Routes,
} from "discord.js";
import { CommandNotFoundError } from "../../shared/errors/CommandNotFound";
import MissingEnvVarError from "../../shared/errors/MissingEnvVarError";
import environment from "../config/environment";
import logMessages from "../constants/log-messages";
import slashCommands, { type SlashCommand } from "../registries/commands";
import LoggerService from "./logger.service";

class CommandsService {
	private commands = new Collection<string, SlashCommand>();
	private rest: REST;
	private readonly token: string;
	private readonly clientId: string;
	private readonly guildId?: string;
	private static instance: CommandsService;

	private constructor(token?: string, clientId?: string, guildId?: string) {
		if (!token) throw new Error("CommandsService requires a bot token.");
		if (!clientId) throw new Error("CommandsService requires a client ID.");

		this.token = token;
		this.clientId = clientId;
		this.guildId = guildId;
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

		for (const command of slashCommands) {
			if (!command?.data?.name || typeof command.execute !== "function") {
				LoggerService.warn(
					logMessages.WARN_COMMAND_FILE_INVALID,
					command?.data?.name || "unknown command",
				);
				continue;
			}
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
			if (environment.SKIP_COMMAND_REGISTRATION) {
				LoggerService.info(logMessages.INFO_SKIP_COMMAND_REGISTRATION);
				return;
			}

			LoggerService.debug(
				logMessages.DEBUG_REGISTER_COMMANDS_START,
				this.commands.size,
			);
			if (this.commands.size === 0) return;

			const commandsData = this.commands.map((cmd) => cmd.data.toJSON());

			if (this.guildId) {
				await this.rest.put(
					Routes.applicationGuildCommands(this.clientId, this.guildId),
					{ body: commandsData },
				);
			} else {
				await this.rest.put(Routes.applicationCommands(this.clientId), {
					body: commandsData,
				});
			}
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

	public static getInstance(
		token?: string,
		clientId?: string,
		guildId?: string,
	) {
		CommandsService.instance ||= new CommandsService(token, clientId, guildId);
		return CommandsService.instance;
	}
}

export default CommandsService.getInstance(
	environment.DISCORD_BOT_TOKEN,
	environment.DISCORD_CLIENT_ID,
);
