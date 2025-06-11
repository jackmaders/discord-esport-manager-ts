import { vi } from "vitest";

const prismaClient = {
	$disconnect: vi.fn(),
};
export { prismaClient };
