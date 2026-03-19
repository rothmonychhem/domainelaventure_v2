import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

function getAccelerateUrl() {
  return process.env.DATABASE_URL || "prisma://localhost?api_key=local-build";
}

function createPrismaClient() {
  return new PrismaClient({
    accelerateUrl: getAccelerateUrl(),
    log: ["error"],
  }).$extends(withAccelerate());
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
