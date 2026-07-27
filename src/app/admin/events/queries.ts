import { prisma } from "@/lib/prisma";

export async function getEventsConfig() {
  const config = await prisma.eventsConfig.findFirst({
    include: { items: { orderBy: { order: "asc" } } },
  });

  if (!config) {
    return {
      id: undefined,
      titleVi: "HOẠT ĐỘNG & SỰ KIỆN",
      titleEn: "ACTIVITIES & EVENTS",
      items: [],
    };
  }

  return {
    id: config.id,
    titleVi: config.titleVi || "HOẠT ĐỘNG & SỰ KIỆN",
    titleEn: config.titleEn || "ACTIVITIES & EVENTS",
    items: config.items.map((item) => ({
      id: item.id,
      slug: item.slug,
      categoryVi: item.categoryVi,
      categoryEn: item.categoryEn,
      titleVi: item.titleVi,
      titleEn: item.titleEn,
      excerptVi: item.excerptVi,
      excerptEn: item.excerptEn,
      coverImg: item.coverImg,
      eventDate: item.eventDate,
      eventTime: item.eventTime,
      authorName: item.authorName,
      authorRole: item.authorRole,
      authorAvatar: item.authorAvatar,
      authorBio: item.authorBio,
      readTime: item.readTime,
      contentHtmlVi: item.contentHtmlVi,
      contentHtmlEn: item.contentHtmlEn,
      published: item.published,
      order: item.order,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      ctaLabel: item.ctaLabel,
      ctaHref: item.ctaHref,
    })),
  };
}

export async function getEventById(id: string) {
  return prisma.eventItem.findUnique({ where: { id } });
}

export async function getPublishedEventsForHome(limit = 4) {
  return prisma.eventItem.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    take: limit,
  });
}

export async function getEventBySlug(slug: string) {
  return prisma.eventItem.findUnique({ where: { slug } });
}

export async function getRelatedEvents(currentId: string, limit = 3) {
  return prisma.eventItem.findMany({
    where: { published: true, id: { not: currentId } },
    orderBy: { order: "asc" },
    take: limit,
  });
}

export async function getSiteCtaConfig() {
  const config = await prisma.siteCtaConfig.findFirst();
  if (config) return config;

  return {
    id: undefined,
    primaryTitle:
      "Sẵn sàng nâng tầm năng lực lãnh đạo và giao tiếp cùng Võ Thị Mỹ Duyên?",
    primaryDesc:
      "Duyên đồng hành cùng cá nhân và doanh nghiệp kiến tạo đội ngũ, truyền cảm hứng và phát triển bền vững.",
    primaryBtn1Label: "KẾT NỐI VỚI DUYÊN",
    primaryBtn1Href: "#",
    primaryBtn2Label: "MỜI DIỄN GIẢ",
    primaryBtn2Href: "#",
    secondaryTitle: "SẴN SÀNG HỢP TÁC & TẠO RA GIÁ TRỊ?",
    secondaryDesc:
      "Duyên luôn sẵn sàng lắng nghe và đồng hành cùng bạn hoặc tổ chức.",
    secondaryBtnLabel: "KẾT NỐI VỚI DUYÊN",
    secondaryBtnHref: "#",
  };
}
