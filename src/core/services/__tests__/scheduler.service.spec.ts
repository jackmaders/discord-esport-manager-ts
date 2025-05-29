import { afterEach, describe, expect, it, vi } from "vitest";

describe("scheduler.service.ts", () => {
	afterEach(() => {
		vi.resetModules();
		vi.unstubAllEnvs();
		vi.useRealTimers();
	});

	it("should export a SchedulerService instance", async () => {
		// Act
		const schedulerService = (await import("../scheduler.service")).default;

		// Assert
		expect(schedulerService).toBeDefined();
		expect(typeof schedulerService).toBe("object");
	});

	it("should return the same instance when imported twice", async () => {
		// Act
		const schedulerService1 = (await import("../scheduler.service")).default;
		const schedulerService2 = (await import("../scheduler.service")).default;

		// Assert
		expect(schedulerService1).toBe(schedulerService2);
	});

	it("should correctly initialise the schedules", async () => {
		const ONE_HOUR_MS = 3600000;

		// Arrange
		vi.useFakeTimers();
		const getSchedules = (await import("../../registries/get-schedules"))
			.default;
		const schedulerService = (await import("../scheduler.service")).default;

		// Act
		await schedulerService.initialise();
		vi.advanceTimersByTime(ONE_HOUR_MS);

		// Assert
		expect(getSchedules).toHaveBeenCalled();
		expect(getSchedules()[0].execute).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(ONE_HOUR_MS);
		expect(getSchedules()[0].execute).toHaveBeenCalledTimes(2);
	});
});

vi.mock("pino");
vi.mock("../../registries/get-schedules");
