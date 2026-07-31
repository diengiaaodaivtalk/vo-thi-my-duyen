import { prisma } from "@/lib/prisma";

export async function getExpertiseData() {
  const expertiseConfig = await prisma.expertiseConfig.findFirst({
    include: { items: { orderBy: { order: "asc" } } },
  });

  return expertiseConfig
    ? {
        id: expertiseConfig.id,
        createdAt: expertiseConfig.createdAt,
        updatedAt: expertiseConfig.updatedAt,
        titleVi: expertiseConfig.titleVi || "CÁC MẢNG CHUYÊN MÔN",
        titleEn: expertiseConfig.titleEn || "AREAS OF EXPERTISE",
        items: expertiseConfig.items.map((item) => ({
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          expertiseConfigId: item.expertiseConfigId,
          order: item.order,
          vi: item.vi || "",
          en: item.en || "",
          icon: item.icon || "",
        })),
      }
    : null;
}
