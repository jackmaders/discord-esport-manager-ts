import { afterEach, describe, expect, it, vi } from "vitest";

describe("scheduler.service.ts", () => {
	afterEach(() => {
		vi.resetModules();
		vi.unstubAllEnvs();
		vi.useRealTimers();
	});

	it("should export a SchedulerService instance", async () => {
		// Act
		const { schedulerService } = await import("../scheduler.service.ts");

		// Assert
		expect(schedulerService).toBeDefined();
		expect(typeof schedulerService).toBe("object");
	});

	it("should return the same instance when imported twice", async () => {
		// Act
		const { schedulerService: service1 } = await import(
			"../scheduler.service.ts"
		);
		const { schedulerService: service2 } = await import(
			"../scheduler.service.ts"
		);

		// Assert
		expect(service1).toBe(service2);
	});

	it("should correctly initialise the schedules", async () => {
		const oneHourMs = 3600000;

		// Arrange
		vi.useFakeTimers();
		const { getSchedules } = await import("../../registries/get-schedules.ts");
		const { schedulerService } = await import("../scheduler.service.ts");

		// Act
		await schedulerService.initialise();
		vi.advanceTimersByTime(oneHourMs);

		// Assert
		expect(getSchedules).toHaveBeenCalled();
		expect(getSchedules()[0].execute).toHaveBeenCalledTimes(1);
		vi.advanceTimersByTime(oneHourMs);
		expect(getSchedules()[0].execute).toHaveBeenCalledTimes(2);
	});
});

vi.mock("pino");
vi.mock("../../registries/get-schedules");
