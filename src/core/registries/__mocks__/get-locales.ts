import { vi } from "vitest";

const locales = {
	en: {
		key1: "value1",
		key2: "values2",
	},
};

export default vi.fn(() => locales);
