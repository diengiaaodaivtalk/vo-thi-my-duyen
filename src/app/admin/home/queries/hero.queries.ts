import { prisma } from "@/lib/prisma";

export async function getHeroData() {
  return prisma.heroConfig.findFirst({
    include: { buttons: { orderBy: { order: "asc" } } },
  });
}
