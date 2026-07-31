import { prisma } from "@/lib/prisma";

export async function getMediaData() {
  const mediaConfig = await prisma.mediaConfig.findFirst({
    include: {
      countries: { orderBy: { order: "asc" } },
      highlights: { orderBy: { order: "asc" } },
      tvStations: { orderBy: { order: "asc" } },
      pressItems: { orderBy: { order: "asc" } },
    },
  });

  return mediaConfig
    ? {
        id: mediaConfig.id,
        titleVi: mediaConfig.titleVi || "",
        titleEn: mediaConfig.titleEn || "",
        descVi: mediaConfig.descVi || "",
        descEn: mediaConfig.descEn || "",
        mapImg: mediaConfig.mapImg || "",
        countries: mediaConfig.countries.map((i) => ({
          id: i.id,
          vi: i.vi || "",
          en: i.en || "",
          flag: i.flag || "",
        })),
        highlights: mediaConfig.highlights.map((i) => ({
          id: i.id,
          titleVi: i.titleVi || "",
          titleEn: i.titleEn || "",
          img: i.img || "",
          href: i.href || "#",
        })),
        tvStations: mediaConfig.tvStations.map((i) => ({
          id: i.id,
          src: i.src || "",
        })),
        pressItems: mediaConfig.pressItems.map((i) => ({
          id: i.id,
          logo: i.logo || "",
          article: i.article || "",
        })),
      }
    : null;
}
