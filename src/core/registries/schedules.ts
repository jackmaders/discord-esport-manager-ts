import availabilityPollSchedule from "../../modules/availability/schedules/availability-poll.schedule";

export default [availabilityPollSchedule] as Schedule[];

export interface Schedule {
	name: string;
	pattern: string | Date;
	execute: () => Promise<void>;
}
