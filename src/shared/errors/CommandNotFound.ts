/**
 * Represents an error thrown when a command interaction is received,
 * but the CommandsService cannot find a corresponding loaded command.
 */
export class CommandNotFoundError extends Error {
	constructor(public readonly commandName: string) {
		super(`Command '/${commandName}' not found.`);

		this.name = "CommandNotFoundError";

		this.commandName = commandName;
	}
}
