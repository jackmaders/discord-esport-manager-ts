import { vi } from "vitest";

const commands = [
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
];

export default vi.fn(() => commands);
