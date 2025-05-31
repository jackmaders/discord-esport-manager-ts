import { vi } from "vitest";

const debug = vi.fn();
const info = vi.fn();
const error = vi.fn();
const warn = vi.fn();

const pino = vi.fn(() => ({
	debug,
	info,
	error,
	warn,
}));

// biome-ignore lint/suspicious/noExplicitAny: Mocking Pino
(pino as any).stdTimeFunctions = {
	isoTime: vi.fn(),
};

// biome-ignore lint/style/noDefaultExport: Mocking Pino
export default pino;
