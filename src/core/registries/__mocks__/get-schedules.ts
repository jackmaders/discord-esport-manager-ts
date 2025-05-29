import { vi } from "vitest";

const schedules = [
	{
		name: "testSchedule",
		pattern: "0 * * * *", // Every hour
		execute: vi.fn(),
	},
];

export default vi.fn(() => schedules);
