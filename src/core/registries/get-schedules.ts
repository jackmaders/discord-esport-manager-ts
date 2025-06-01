import { availabilityPollSchedule } from "../../modules/availability/schedules/availability-poll-schedule.ts";
import { loggerService } from "../services/logger.service.ts";
import { GetSchedulesLogs } from "./logs/get-schedules.logs.ts";

export interface Schedule {
	name: string;
	pattern: string | Date;
	execute: () => Promise<void>;
}

const schedules = [availabilityPollSchedule];

export function getSchedules(): Schedule[] {
	loggerService.info(GetSchedulesLogs.Start);

	return schedules;
}
