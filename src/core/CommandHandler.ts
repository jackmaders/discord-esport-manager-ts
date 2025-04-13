import { Collection, type Interaction, REST, Routes } from "discord.js";

import pingCommand from "../modules/ping/commands/ping-command";
import handlePing from "../modules/ping/handlers/ping-handler";
import logger from "./Logger";
import LogMessages from "./constants/LogMessages";
import type { SlashCommand } from "./types/Commands";

export default class CommandHandler {
	commands = new Collection<string, SlashCommand>();

	constructor(
		private botToken: string,
		private clientId: string,
		private guildId?: string,
	) {
		this.initialiseCommands();
		this.registerCommands();
	}

	initialiseCommands() {
		logger.info(LogMessages.CH_INFO_INIT_COMMANDS);

		this.commands.clear();

		// TODO: Refactor this to load commands dynamically
		this.commands.set(pingCommand.name, {
			data: pingCommand,
			execute: handlePing,
		});
	}

	async registerCommands() {
		logger.info(LogMessages.CH_INFO_REGISTER_COMMANDS);
		const rest = new REST({ version: "10" }).setToken(this.botToken);

		const commandsValues = Array.from(this.commands.values());
		const commandsData = commandsValues.map((cmd) => cmd.data.toJSON());

		let route: `/${string}`;
		let deploymentType: string;

		if (this.guildId) {
			route = Routes.applicationGuildCommands(this.clientId, this.guildId);
			deploymentType = `Guild (${this.guildId})`;
		} else {
			route = Routes.applicationCommands(this.clientId);
			deploymentType = "Global";
		}

		await rest.put(route, { body: commandsData });
	}

	async handleInteraction(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = this.commands.get(interaction.commandName);

		if (!command) {
			logger.error(
				LogMessages.CH_ERROR_COMMAND_NOT_FOUND,
				interaction.commandName,
			);
			return;
		}

		logger.info(
			LogMessages.CH_INFO_HANDLE_INTERACTION,
			interaction.commandName,
		);
		await command.execute(interaction);
	}
}
