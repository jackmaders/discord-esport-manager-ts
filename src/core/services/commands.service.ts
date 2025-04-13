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
import commands from "../commands";
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
	 * Loads commands and registers them with Discord.
	 */
	async init() {
		logger.debug(LogMessages.DEBUG_INIT_SERVICE_START);

		this.loadModules();
		await this.registerCommands();

		logger.debug(LogMessages.DEBUG_INIT_SERVICE_END);
	}

	/**
	 * Loads all modules and their commands.
	 */
	private loadModules() {
		logger.debug(LogMessages.DEBUG_LOAD_MODULES_START);
		this.commands.clear();

		for (const command of commands) {
			if (!command?.data?.name || typeof command.execute !== "function") {
				logger.warn(
					LogMessages.WARN_COMMAND_FILE_INVALID,
					command?.data?.name || "unknown command",
				);
				continue;
			}
			if (this.commands.has(command.data.name)) {
				logger.warn(
					LogMessages.WARN_COMMAND_ALREADY_REGISTERED,
					command.data.name,
				);
				continue;
			}
			this.commands.set(command.data.name, command);
			logger.debug(LogMessages.DEBUG_LOAD_COMMAND_FILE_END, command.data.name);
		}

		if (this.commands.size === 0) {
			logger.warn(LogMessages.WARN_NO_COMMANDS_RECOGNISED);
		}
		logger.debug(LogMessages.DEBUG_LOAD_MODULES_END);
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
