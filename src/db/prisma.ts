import { PrismaClient } from "@prisma/client";

/**
 * Global namespace extension to store a PrismaClient instance.
 * This ensures a singleton PrismaClient instance across hot reloads
 * in development to prevent exhausting database connections.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * PrismaClient instance.
 * Uses existing instance if available on global object,
 * otherwise creates a new PrismaClient instance.
 */
const prisma = globalForPrisma.prisma || new PrismaClient();

/**
 * In development mode, assign the PrismaClient instance to the global object
 * to maintain a singleton instance across module reloads.
 */
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
