import { prisma } from "@/lib/prisma";

export async function getServicesData() {
  const servicesConfig = await prisma.servicesConfig.findFirst({
    include: { items: { orderBy: { order: "asc" } } },
  });

  return servicesConfig
    ? {
        id: servicesConfig.id,
        createdAt: servicesConfig.createdAt,
        updatedAt: servicesConfig.updatedAt,
        titleVi: servicesConfig.titleVi || "DỊCH VỤ CUNG CẤP",
        titleEn: servicesConfig.titleEn || "SERVICES",
        items: servicesConfig.items.map((item) => ({
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          servicesConfigId: item.servicesConfigId,
          order: item.order,
          vi: item.vi || "",
          en: item.en || "",
          img: item.img || "",
        })),
      }
    : null;
}
