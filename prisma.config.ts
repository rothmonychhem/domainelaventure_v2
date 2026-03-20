import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL || "";

if (!databaseUrl) {
  throw new Error(
    "Set DIRECT_DATABASE_URL or DATABASE_URL in .env before running Prisma commands."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
