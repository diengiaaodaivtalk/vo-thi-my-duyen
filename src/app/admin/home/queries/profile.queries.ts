import { prisma } from "@/lib/prisma";

export async function getProfileData() {
  return prisma.profileConfig.findFirst({
    include: { items: { orderBy: { order: "asc" } } },
  });
}
