import { prisma } from "@/lib/prisma";

export async function getActivityData() {
  const activityConfig = await prisma.activityConfig.findFirst({
    include: { items: { orderBy: { order: "asc" } } },
  });

  return activityConfig
    ? {
        id: activityConfig.id,
        titleVi: activityConfig.titleVi || "HÌNH ẢNH HOẠT ĐỘNG",
        titleEn: activityConfig.titleEn || "ACTIVITY HIGHLIGHTS",
        items: activityConfig.items.map((item) => ({
          id: item.id,
          src: item.src || "",
        })),
      }
    : null;
}
