import { vi } from "vitest";

const getAvailabilityChannelId = vi.fn(() => 12345);

export const guildConfigService = { getAvailabilityChannelId };
