import availabilityPollSchedule from "../../modules/availability/schedules/availability-poll.schedule";

export interface Schedule {
	name: string;
	pattern: string | Date;
	execute: () => Promise<void>;
}

function getSchedules(): Schedule[] {
	return [availabilityPollSchedule];
}

export default getSchedules;
