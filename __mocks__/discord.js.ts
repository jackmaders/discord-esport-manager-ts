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

export default {};
