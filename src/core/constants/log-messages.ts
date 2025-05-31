export enum LogMessages {
	// Bot Entrypoint
	InfoBotStart = "Starting bot...",
	InfoBotLogin = "Logged in as '%s'.",
	InfoBotReady = "Bot is ready.",
	InfoBotShutdown = "Shutting down bot...",

	// I18n
	DebugI18nInit = "I18n initialized.",

	// Commands Service
	InfoSkipCommandRegistration = "Skipping command registration.",
	DebugInitServiceStart = "Initializing Commands Service...",
	DebugInitServiceEnd = "Commands Service initialized.",
	DebugLoadModulesStart = "Loading module(s)...",
	DebugLoadModulesEnd = "Module(s) loaded.",
	DebugLoadCommandFileStart = "Loading '%s' command file...",
	DebugLoadCommandFileEnd = "Command file '%s' loaded.",
	DebugRegisterCommandsStart = "Registering %s command(s)...",
	DebugRegisterCommandsEnd = "Commands registered.",
	DebugHandleInteractionStart = "Handling '/%s' interaction...",
	DebugHandleInteractionEnd = "Interaction '/%s' complete.",
	DebugNoCommandsFound = "No '/commands' directory found for module '%s'; skipping.",
	WarnCommandFileNotRecognised = "Command file '%s' not recognised; skipping.",
	WarnCommandFileInvalid = "Command file '%s' did not have the correct export; skipping.",
	WarnCommandAlreadyRegistered = "Command '%s' already registered; skipping.",
	WarnNoCommandsRecognised = "No commands recognised after loading modules.",
	ErrorLoadModule = "Error loading module '%s'; skipping.",
	ErrorLoadCommandFile = "Error loading command file '%s'; skipping.",
	ErrorRegisterCommands = "Error registering commands; some commands may be unavailable.",

	// Logger
	DebugLoggerInit = "Logger initialized with level= '%s'",

	// Interaction Handler
	ErrorHandleInteraction = "Error handling interaction '/%s'; attempting to provide error response.",
	WarnInteractionNotRepliable = "Interaction not repliable; cannot send error message.",
	DebugCannotReply = "Cannot reply to interaction; sending another reply.",
	WarnCommandNotFound = "Command '/%s' not found.",
}
