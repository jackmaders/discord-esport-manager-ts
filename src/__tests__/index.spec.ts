import { afterEach, describe, expect, it, vi } from "vitest";
import { setupSignalHandlers } from "../core/utils/setup-signal-handlers.ts";
import { main } from "../main.ts";

describe("index.ts", () => {
	afterEach(() => {
		vi.resetModules();
	});

	it("should call main entrypoint", async () => {
		// Act
		await import("../index.ts");

		// Assert
		expect(main).toHaveBeenCalled();
	});

	it("should call setupSignalHandlers", async () => {
		// Act
		await import("../index.ts");

		// Assert
		expect(setupSignalHandlers).toHaveBeenCalled();
	});
});

vi.mock("../main.ts");
vi.mock("../core/utils/setup-signal-handlers.ts");
vi.mock("../core/services/logger.service.ts");
