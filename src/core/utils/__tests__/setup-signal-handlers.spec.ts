import { describe, expect, it, vi } from "vitest";
import { exitProcess } from "../exit-process.ts";
import { setupSignalHandlers } from "../setup-signal-handlers.ts";

describe("utils.ts", () => {
	it("should setup even handlers for SIGINT and SIGTERM", () => {
		// Arrange
		vi.spyOn(process, "on").mockImplementation(vi.fn());

		// Act
		setupSignalHandlers();

		// Assert
		expect(process.on).toHaveBeenCalledWith("SIGINT", expect.any(Function));
		expect(process.on).toHaveBeenCalledWith("SIGTERM", expect.any(Function));
	});

	it("should call exitProcess for SIGINT and SIGTERM", () => {
		// Arrange
		vi.spyOn(process, "on").mockImplementation((_, fn) => {
			fn();
			return process;
		});

		// Act
		setupSignalHandlers();

		// Assert
		expect(exitProcess).toHaveBeenCalledTimes(2);
	});
});

vi.mock("../exit-process.ts");
vi.mock("../../services/logger.service.ts");
