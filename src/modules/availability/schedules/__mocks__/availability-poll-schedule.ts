import { vi } from "vitest";

export const availabilityPollSchedule = {
	name: "Weekly Availability Poll",
	pattern: "0 18 * * 5", // Every Friday at 18:00
	execute: vi.fn(),
};
