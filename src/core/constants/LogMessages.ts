export default {
	// Bot Entrypoint
	INFO_BOT_START: "Starting bot...",
	INFO_BOT_LOGIN: "Logged in as '%s'.",
	INFO_BOT_READY: "Bot is ready.",
	INFO_BOT_SHUTDOWN: "Shutting down bot...",

	// Commands Service
	INFO_SKIP_COMMAND_REGISTRATION: "Skipping command registration.",
	DEBUG_INIT_SERVICE_START: "Initializing Commands Service...",
	DEBUG_INIT_SERVICE_END: "Commands Service initialized.",
	DEBUG_LOAD_MODULES_START: "Loading module(s)...",
	DEBUG_LOAD_MODULES_END: "Module(s) loaded.",
	DEBUG_LOAD_MODULE_START: "Loading '%s' module...",
	DEBUG_LOAD_MODULE_END: "Module '%s' loaded.",
	DEBUG_LOAD_COMMAND_FILE_START: "Loading '%s' command file...",
	DEBUG_LOAD_COMMAND_FILE_END: "Command file '%s' loaded.",
	DEBUG_REGISTER_COMMANDS_START: "Registering %s command(s)...",
	DEBUG_REGISTER_COMMANDS_END: "Commands registered.",
	DEBUG_HANDLE_INTERACTION_START: "Handling '/%s' interaction...",
	DEBUG_HANDLE_INTERACTION_END: "Interaction '/%s' complete.",
	DEBUG_NO_COMMANDS_FOUND:
		"No '/commands' directory found for module '%s'; skipping.",
	WARN_COMMAND_FILE_NOT_RECOGNISED:
		"Command file '%s' not recognised; skipping.",
	WARN_COMMAND_FILE_INVALID:
		"Command file '%s' did not have the correct export; skipping.",
	WARN_COMMAND_ALREADY_REGISTERED: "Command '%s' already registered; skipping.",
	WARN_NO_COMMANDS_RECOGNISED: "No commands recognised after loading modules.",
	ERROR_LOAD_MODULE: "Error loading module '%s'; skipping.",
	ERROR_LOAD_COMMAND_FILE: "Error loading command file '%s'; skipping.",
	ERROR_REGISTER_COMMANDS:
		"Error registering commands; some commands may be unavailable.",

	// Logger
	DEBUG_LOGGER_INIT: "Logger initialized with level: '%s'",

	// Interaction Handler
	ERROR_HANDLE_INTERACTION:
		"Error handling interaction '/%s'; attempting to provide error response.",
	WARN_INTERACTION_NOT_REPLIABLE:
		"Interaction not repliable; cannot send error message.",
	DEBUG_CANNOT_REPLY: "Cannot reply to interaction; sending another reply.",
	WARN_COMMAND_NOT_FOUND: "Command '/%s' not found.",
};
