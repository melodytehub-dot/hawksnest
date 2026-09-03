import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const url = process.env.DATABASE_URL || "postgresql://localhost:5432/hawksnest";
  const adapter = new PrismaNeonHttp(url, {});
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma ??
  createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
