import { vi } from "vitest";

export const REST = vi.fn(() => ({
	setToken: vi.fn().mockReturnThis(),
	put: vi.fn(),
	get: vi.fn(),
	post: vi.fn(),
	patch: vi.fn(),
	delete: vi.fn(),
}));

export const Routes = {
	applicationCommands: vi.fn(),
};

export const Client = vi.fn();

export enum GatewayIntentBits {
	Guilds = 1,
	GuildMembers = 2,
	GuildModeration = 4,
	GuildBans = 4,
	GuildExpressions = 8,
	GuildEmojisAndStickers = 8,
	GuildIntegrations = 16,
	GuildWebhooks = 32,
	GuildInvites = 64,
	GuildVoiceStates = 128,
	GuildPresences = 256,
	GuildMessages = 512,
	GuildMessageReactions = 1024,
	GuildMessageTyping = 2048,
	DirectMessages = 4096,
	DirectMessageReactions = 8192,
	DirectMessageTyping = 16384,
	MessageContent = 32768,
	GuildScheduledEvents = 65536,
	AutoModerationConfiguration = 1048576,
	AutoModerationExecution = 2097152,
	GuildMessagePolls = 16777216,
	DirectMessagePolls = 33554432,
}
