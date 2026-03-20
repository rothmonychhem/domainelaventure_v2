import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  return process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || "";
}

function createPrismaClient() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    throw new Error(
      "DIRECT_DATABASE_URL or DATABASE_URL must be set to connect Prisma."
    );
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
