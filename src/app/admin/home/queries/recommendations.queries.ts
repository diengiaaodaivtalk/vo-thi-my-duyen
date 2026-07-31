import { prisma } from "@/lib/prisma";

export async function getRecommendationsData() {
  const recommendationsConfig = await prisma.recommendationsConfig.findFirst({
    include: { items: { orderBy: { order: "asc" } } },
  });

  return recommendationsConfig
    ? {
        id: recommendationsConfig.id,
        titleVi: recommendationsConfig.titleVi || "RECOMMENDATIONS",
        subtitle:
          recommendationsConfig.subtitle ||
          "Chia sẻ từ Lãnh đạo, Đối tác & Cấp quản lý",
        descVi: recommendationsConfig.descVi || "",
        items: recommendationsConfig.items.map((item) => ({
          id: item.id,
          name: item.name || "",
          roleLine1: item.roleLine1 || "",
          roleLine2: item.roleLine2 || "",
          timeAgo: item.timeAgo || "",
          quote: item.quote || "",
          avatar: item.avatar || "",
        })),
      }
    : null;
}
