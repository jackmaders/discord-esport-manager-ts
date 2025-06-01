import { vi } from "vitest";

export const discordClient = {
	destroy: vi.fn(),
	login: vi.fn(),
	on: vi.fn((_, fn) => fn()),
	once: vi.fn((_, fn) => fn()),
};
