import type PinoLogger from "pino";
import { type Mock, vi } from "vitest";

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

// biome-ignore lint/suspicious/noExplicitAny: Allow mocking of Pino's type
(pino as any).stdTimeFunctions = {
	isoTime: vi.fn(),
};

export default pino;
