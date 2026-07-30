import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makePrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  const pool = new pg.Pool({
    connectionString,
    max: 3,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = makePrismaClient();
    }
    return (globalForPrisma.prisma as unknown as Record<string, unknown>)[
      prop as string
    ];
  },
});
