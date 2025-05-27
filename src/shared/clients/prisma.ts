import { PrismaClient } from "../../../prisma/generated/prisma-client-js";
import environment from "../../core/config/environment";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices
declare global {
	var prisma: PrismaClient | undefined;
}

const prismaClient = global.prisma ?? new PrismaClient({});

if (environment.NODE_ENV !== "production") global.prisma = prismaClient;

export default prismaClient;
