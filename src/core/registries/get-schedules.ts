import { availabilityPollSchedule } from "../../modules/availability/schedules/availability-poll.schedule";

export interface Schedule {
	name: string;
	pattern: string | Date;
	execute: () => Promise<void>;
}

const schedules = [availabilityPollSchedule];

export function getSchedules(): Schedule[] {
	return schedules;
}
