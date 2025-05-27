import { Cron } from "croner";
import schedules from "../registries/schedules";

class SchedulerService {
	private static instance: SchedulerService;

	private constructor() {}

	async initialise() {
		for (const schedule of schedules) {
			new Cron(schedule.pattern, { name: schedule.name }, schedule.execute);
		}
	}

	public static getInstance() {
		SchedulerService.instance ||= new SchedulerService();
		return SchedulerService.instance;
	}
}

export default SchedulerService.getInstance();
