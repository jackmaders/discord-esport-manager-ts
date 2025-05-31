import { Cron } from "croner";
import { getSchedules } from "../registries/get-schedules.ts";

class SchedulerService {
	private static instance: SchedulerService;

	private constructor() {}

	initialise() {
		for (const schedule of getSchedules()) {
			new Cron(schedule.pattern, { name: schedule.name }, schedule.execute);
		}
	}

	public static getInstance() {
		SchedulerService.instance ||= new SchedulerService();
		return SchedulerService.instance;
	}
}

export const schedulerService = SchedulerService.getInstance();
