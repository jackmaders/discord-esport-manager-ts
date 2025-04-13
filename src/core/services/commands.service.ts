import type { Dirent } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
	type CacheType,
	Collection,
	type Interaction,
	REST,
	Routes,
} from "discord.js";
import { CommandNotFoundError } from "../../shared/errors/CommandNotFound";
import logger from "../Logger";
import LogMessages from "../constants/LogMessages";
import type { SlashCommand } from "../types/Commands";

export default class CommandsService {
	private commands = new Collection<string, SlashCommand>();
	private rest: REST;
	private readonly token: string;
	private readonly clientId: string;
	private readonly guildId?: string;
	private readonly modulesPath = path.join(process.cwd(), "src", "modules");

	constructor(token: string, clientId: string, guildId?: string) {
		if (!token) throw new Error("CommandsService requires a bot token.");
		if (!clientId) throw new Error("CommandsService requires a client ID.");

		this.token = token;
		this.clientId = clientId;
		this.guildId = guildId;
		this.rest = new REST({ version: "10" }).setToken(this.token);
	}

	/**
	 * Loads commands dynamically and registers them with Discord.
	 */
	async init() {
		logger.debug(LogMessages.DEBUG_INIT_SERVICE_START);

		await this.loadModules();
		await this.registerCommands();

		logger.debug(LogMessages.DEBUG_INIT_SERVICE_END);
	}

	/**
	 * Orchestrates the loading of commands by finding modules and processing them.
	 */
	private async loadModules() {
		logger.debug(LogMessages.DEBUG_LOAD_MODULES_START);

		this.commands.clear();

		const allEntries = await readdir(this.modulesPath, {
			withFileTypes: true,
		});

		const directories = allEntries.filter((dirent) => dirent.isDirectory());
		const promises = directories.map(this.processModule.bind(this));

		await Promise.all(promises);

		logger.debug(LogMessages.DEBUG_LOAD_MODULES_END);

		if (this.commands.size === 0)
			logger.warn(LogMessages.WARN_NO_COMMANDS_RECOGNISED);
	}

	/**
	 * Processes a single module directory to find and load commands.
	 */
	private async processModule(moduleDirent: Dirent) {
		try {
			logger.debug(LogMessages.DEBUG_LOAD_MODULE_START, moduleDirent.name);

			const moduleName = moduleDirent.name;
			const commandsPath = path.join(this.modulesPath, moduleName, "commands");
			try {
				const stats = await stat(commandsPath);
				const commandsDirExists = stats.isDirectory();

				if (!commandsDirExists) {
					logger.debug(LogMessages.DEBUG_NO_COMMANDS_FOUND, moduleName);
					return;
				}
			} catch (error) {
				logger.debug(LogMessages.DEBUG_NO_COMMANDS_FOUND, moduleName);
				return;
			}

			const commandFiles = await readdir(commandsPath);
			for (const file of commandFiles) {
				if (!(file.endsWith(".command.ts") || file.endsWith(".command.js"))) {
					logger.warn(LogMessages.WARN_COMMAND_FILE_NOT_RECOGNISED, file);
					continue;
				}

				const filePath = path.join(commandsPath, file);
				await this.loadCommandFile(filePath);
			}

			logger.debug(LogMessages.DEBUG_LOAD_MODULE_END, moduleDirent.name);
		} catch (error) {
			logger.error(error, LogMessages.ERROR_LOAD_MODULE, moduleDirent.name);
		}
	}

	/**
	 * Loads, validates, and stores a single command from its file path.
	 */
	private async loadCommandFile(filePath: string) {
		try {
			const fileName = path.basename(filePath);
			logger.debug(LogMessages.DEBUG_LOAD_COMMAND_FILE_START, fileName);

			const fileUrl = pathToFileURL(filePath).href;

			const commandModule = await import(fileUrl);
			const command = commandModule.default;

			if (!command.data.name || !command.execute) {
				logger.warn(LogMessages.WARN_COMMAND_FILE_INVALID, fileName);
				return;
			}

			const slashCommand = command as SlashCommand;

			if (this.commands.has(slashCommand.data.name)) {
				logger.warn(LogMessages.WARN_COMMAND_ALREADY_REGISTERED, fileName);
				return;
			}

			this.commands.set(slashCommand.data.name, slashCommand);
			logger.debug(LogMessages.DEBUG_LOAD_COMMAND_FILE_END, fileName);
		} catch (error) {
			const fileName = path.basename(filePath);
			logger.error(error, LogMessages.ERROR_LOAD_COMMAND_FILE, fileName);
		}
	}

	/**
	 * Registers the loaded slash commands with Discord's API.
	 */
	private async registerCommands() {
		try {
			if (process.env.SKIP_COMMAND_REGISTRATION) {
				logger.info(LogMessages.INFO_SKIP_COMMAND_REGISTRATION);
				return;
			}

			logger.debug(
				LogMessages.DEBUG_REGISTER_COMMANDS_START,
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
			logger.debug(LogMessages.DEBUG_REGISTER_COMMANDS_END);
		} catch (error) {
			logger.error(error, LogMessages.ERROR_REGISTER_COMMANDS);
		}
	}

	/**
	 * Handles incoming interactions and executes the corresponding command.
	 */
	async handleInteraction(interaction: Interaction<CacheType>) {
		if (!interaction.isChatInputCommand()) return;
		const { commandName } = interaction;

		logger.debug(LogMessages.DEBUG_HANDLE_INTERACTION_START, commandName);

		const command = this.commands.get(commandName);

		if (!command) throw new CommandNotFoundError(commandName);

		await command.execute(interaction);
		logger.debug(LogMessages.DEBUG_HANDLE_INTERACTION_END, commandName);
	}
}
