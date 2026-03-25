import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
const MISSING_DATABASE_URL_MESSAGE =
  "DIRECT_DATABASE_URL or DATABASE_URL must be set to connect Prisma.";

function getDatabaseUrl() {
  return process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || "";
}

function createPrismaClient() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    return new Proxy(
      {},
      {
        get() {
          throw new Error(MISSING_DATABASE_URL_MESSAGE);
        },
      }
    ) as PrismaClient;
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
