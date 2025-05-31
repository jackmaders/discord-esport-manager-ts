import { vi } from "vitest";

const locales = {
	en: {
		key1: "value1",
		key2: "values2",
	},
};

export const getLocales = vi.fn(() => locales);
