/**
 * Represents an error thrown when a command is attempted to be executed,
 * but the command is only available in a guild context.
 */
export class GuildOnlyError extends Error {
	constructor(public readonly commandName: string) {
		super(`Cannot execute command "${commandName}" outside a guild.`);

		this.name = "GuildOnlyError";
	}
}
