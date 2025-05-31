import { exitProcess } from "./exit-process.ts";

/**
 * Sets up process signal handlers for graceful shutdown.
 */
export function setupSignalHandlers(): void {
	const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

	for (const signal of signals) {
		process.on(signal, () => {
			exitProcess(0);
		});
	}
}
