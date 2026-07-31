import { prisma } from "@/lib/prisma";

export async function getStatsData() {
  return prisma.stat.findMany({ orderBy: { order: "asc" } });
}
