import { vi } from "vitest";

export default vi.fn(() => [
	{
		data: {
			name: "test",
			description: "This is a test command",
		},
		execute: vi.fn(),
	},
	{
		data: {
			name: "anotherTest",
			description: "This is another test command",
		},
		execute: vi.fn(),
	},
]);
