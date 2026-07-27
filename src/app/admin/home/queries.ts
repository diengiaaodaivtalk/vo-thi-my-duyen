import { prisma } from "@/lib/prisma";

export async function getAdminHomeData() {
  const [
    heroData,
    statsData,
    profileData,
    expertiseConfig,
    servicesConfig,
    mediaConfig,
    connectTrainingConfig,
    activityConfig,
    clientConfig,
    recommendationsConfig,
    articlesConfig,
    categories,
    articles,
  ] = await Promise.all([
    prisma.heroConfig.findFirst({
      include: { buttons: { orderBy: { order: "asc" } } },
    }),
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
    prisma.profileConfig.findFirst({
      include: { items: { orderBy: { order: "asc" } } },
    }),
    prisma.expertiseConfig.findFirst({
      include: { items: { orderBy: { order: "asc" } } },
    }),
    prisma.servicesConfig.findFirst({
      include: { items: { orderBy: { order: "asc" } } },
    }),
    prisma.mediaConfig.findFirst({
      include: {
        countries: { orderBy: { order: "asc" } },
        highlights: { orderBy: { order: "asc" } },
        tvStations: { orderBy: { order: "asc" } },
        pressItems: { orderBy: { order: "asc" } },
      },
    }),
    prisma.connectTrainingConfig.findFirst({
      include: {
        programs: { orderBy: { order: "asc" } },
        socials: { orderBy: { order: "asc" } },
      },
    }),
    prisma.activityConfig.findFirst({
      include: { items: { orderBy: { order: "asc" } } },
    }),
    prisma.clientConfig.findFirst({
      include: {
        tabs: {
          orderBy: { order: "asc" },
          include: { logos: { orderBy: { order: "asc" } } },
        },
      },
    }),
    prisma.recommendationsConfig.findFirst({
      include: { items: { orderBy: { order: "asc" } } },
    }),
    prisma.articlesConfig.findFirst(),
    prisma.articleCategory.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.article.findMany({
      orderBy: { order: "asc" },
      include: { pages: { orderBy: { order: "asc" } } },
    }),
  ]);

  const sanitizedExpertiseData = expertiseConfig
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

  const sanitizedServicesData = servicesConfig
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

  const sanitizedRecommendationsData = recommendationsConfig
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

  const sanitizedMediaData = mediaConfig
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

  const mapArticle = (a: (typeof articles)[number]) => ({
    id: a.id,
    row: a.row,
    title: a.title || "",
    description: a.description || "",
    categoryId: a.categoryId || "",
    date: a.date || "",
    publisher: a.publisher || "",
    link: a.link || "#",
    img: a.img || "",
    pages: a.pages.map((p) => ({ id: p.id, src: p.src || "" })),
  });

  const sanitizedArticlesData = {
    titleVi: articlesConfig?.titleVi || "CÁC BÀI VIẾT ĐÃ XUẤT BẢN",
    titleEn: articlesConfig?.titleEn || "Published Articles",
    descVi: articlesConfig?.descVi || "",
    descEn: articlesConfig?.descEn || "",
    categories: categories.map((c) => ({
      id: c.id,
      vi: c.vi || "",
      en: c.en || "",
    })),
    row1: articles.filter((a) => a.row === 1).map(mapArticle),
    row2: articles.filter((a) => a.row === 2).map(mapArticle),
  };

  const sanitizedConnectTrainingData = connectTrainingConfig
    ? {
        id: connectTrainingConfig.id,
        trainingTitleVi: connectTrainingConfig.trainingTitleVi || "",
        trainingTitleEn: connectTrainingConfig.trainingTitleEn || "",
        connectTitleVi: connectTrainingConfig.connectTitleVi || "",
        connectTitleEn: connectTrainingConfig.connectTitleEn || "",
        fanpageTitle: connectTrainingConfig.fanpageTitle || "",
        fanpageUrl: connectTrainingConfig.fanpageUrl || "",
        logoIcon: connectTrainingConfig.logoIcon || "",
        programs: connectTrainingConfig.programs.map((i) => ({
          id: i.id,
          vi: i.vi || "",
          en: i.en || "",
          icon: i.icon || "",
        })),
        socials: connectTrainingConfig.socials.map((i) => ({
          id: i.id,
          titleVi: i.titleVi || "",
          titleEn: i.titleEn || "",
          linkText: i.linkText || "",
          url: i.url || "",
          bgColor: i.bgColor || "#1877F2",
          iconImg: i.iconImg || "",
        })),
      }
    : null;

  const sanitizedActivityData = activityConfig
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

  const sanitizedClientsData = clientConfig
    ? {
        id: clientConfig.id,
        titleVi: clientConfig.titleVi || "KHÁCH HÀNG CHIẾN LƯỢC",
        titleEn: clientConfig.titleEn || "STRATEGIC CLIENTS",
        footerVi: clientConfig.footerVi || "",
        footerEn: clientConfig.footerEn || "",
        tabs: clientConfig.tabs.map((t) => ({
          id: t.id,
          tabKey: t.tabKey,
          vi: t.vi || "",
          en: t.en || "",
          logos: t.logos.map((l) => ({ id: l.id, src: l.src || "" })),
        })),
      }
    : null;

  return {
    heroData,
    statsData,
    profileData,
    sanitizedExpertiseData,
    sanitizedServicesData,
    sanitizedRecommendationsData,
    sanitizedArticlesData,
    sanitizedMediaData,
    sanitizedConnectTrainingData,
    sanitizedActivityData,
    sanitizedClientsData,
  };
}