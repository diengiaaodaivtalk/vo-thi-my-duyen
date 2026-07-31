"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import {
  ButtonParam,
  StatItemParam,
  ProfileItemParam,
  ExpertiseItemParam,
  ServiceItemParam,
  CountryParam,
  HighlightParam,
  TvParam,
  PressParam,
  ProgramParam,
  SocialParam,
  ActivityItemParam,
  TabItemParam,
  ArticleCategoryParam,
  ArticleItemParam,
  RecommendationItemParam,
} from "./types";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateHeroAction(
  formData: FormData,
  buttonsList: ButtonParam[],
  imageFile: File | null,
) {
  const topSubtitle = (formData.get("topSubtitle") as string) || "";
  const mainTitleLine1 = (formData.get("mainTitleLine1") as string) || "";
  const mainTitleLine2 = (formData.get("mainTitleLine2") as string) || "";
  const engSubtitle = (formData.get("engSubtitle") as string) || "";
  const descVi = (formData.get("descVi") as string) || "";
  const descEn = (formData.get("descEn") as string) || "";
  const existingHero = await prisma.heroConfig.findFirst();
  const currentBgUrl = await uploadAndCleanStorage({
    bucketName: "hero-images",
    newFile: imageFile,
    oldUrl: existingHero?.bgUrl,
  });
  if (existingHero) {
    await prisma.$transaction([
      prisma.heroButton.deleteMany({
        where: { heroConfigId: existingHero.id },
      }),
      prisma.heroConfig.update({
        where: { id: existingHero.id },
        data: {
          topSubtitle,
          mainTitleLine1,
          mainTitleLine2,
          engSubtitle,
          descVi,
          descEn,
          bgUrl: currentBgUrl,
          buttons: {
            create: buttonsList.map((btn, idx) => ({
              textVi: btn.textVi || "",
              textEn: btn.textEn || "",
              href: btn.href || "",
              primary: btn.primary || false,
              order: idx,
            })),
          },
        },
      }),
    ]);
  } else {
    await prisma.heroConfig.create({
      data: {
        topSubtitle,
        mainTitleLine1,
        mainTitleLine2,
        engSubtitle,
        descVi,
        descEn,
        bgUrl: currentBgUrl,
        buttons: {
          create: buttonsList.map((btn, idx) => ({
            textVi: btn.textVi || "",
            textEn: btn.textEn || "",
            href: btn.href || "",
            primary: btn.primary || false,
            order: idx,
          })),
        },
      },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateStatsAction(
  formData: FormData,
  statsList: StatItemParam[],
) {
  const processedStats = [];
  for (let i = 0; i < statsList.length; i++) {
    const item = statsList[i];
    let currentIconSrc = item.iconSrc;
    if (item.imageFile) {
      currentIconSrc = await uploadAndCleanStorage({
        bucketName: "stat-images",
        newFile: item.imageFile,
        oldUrl: item.id ? item.iconSrc : null,
      });
    }
    processedStats.push({
      value: item.value || "",
      titleVi: item.titleVi || "",
      titleEn: item.titleEn || "",
      iconSrc: currentIconSrc || "",
      order: i,
    });
  }
  await prisma.$transaction([
    prisma.stat.deleteMany({}),
    prisma.stat.createMany({ data: processedStats }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateProfileAction(
  formData: FormData,
  itemsList: ProfileItemParam[],
  avatarFile: File | null,
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const existingProfile = await prisma.profileConfig.findFirst();
  const currentAvatarUrl = await uploadAndCleanStorage({
    bucketName: "profile-images",
    newFile: avatarFile,
    oldUrl: existingProfile?.avatarUrl,
  });
  if (existingProfile) {
    await prisma.$transaction([
      prisma.profileItem.deleteMany({
        where: { profileConfigId: existingProfile.id },
      }),
      prisma.profileConfig.update({
        where: { id: existingProfile.id },
        data: {
          titleVi,
          titleEn,
          avatarUrl: currentAvatarUrl,
          items: {
            create: itemsList.map((item, idx) => ({
              vi: item.vi || "",
              en: item.en || "",
              order: idx,
            })),
          },
        },
      }),
    ]);
  } else {
    await prisma.profileConfig.create({
      data: {
        titleVi,
        titleEn,
        avatarUrl: currentAvatarUrl,
        items: {
          create: itemsList.map((item, idx) => ({
            vi: item.vi || "",
            en: item.en || "",
            order: idx,
          })),
        },
      },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateExpertiseAction(
  formData: FormData,
  expertiseList: ExpertiseItemParam[],
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const processedItems = [];
  for (let i = 0; i < expertiseList.length; i++) {
    const item = expertiseList[i];
    let currentIcon = item.icon;
    if (item.imageFile) {
      currentIcon = await uploadAndCleanStorage({
        bucketName: "expertise-images",
        newFile: item.imageFile,
        oldUrl: item.id ? item.icon : null,
      });
    }
    processedItems.push({
      vi: item.vi || "",
      en: item.en || "",
      icon: currentIcon || "",
      order: i,
    });
  }
  const existingConfig = await prisma.expertiseConfig.findFirst();
  if (existingConfig) {
    await prisma.$transaction([
      prisma.expertise.deleteMany({
        where: { expertiseConfigId: existingConfig.id },
      }),
      prisma.expertiseConfig.update({
        where: { id: existingConfig.id },
        data: { titleVi, titleEn, items: { create: processedItems } },
      }),
    ]);
  } else {
    await prisma.expertiseConfig.create({
      data: { titleVi, titleEn, items: { create: processedItems } },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateServicesAction(
  formData: FormData,
  servicesList: ServiceItemParam[],
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const processedItems = [];
  for (let i = 0; i < servicesList.length; i++) {
    const item = servicesList[i];
    let currentImg = item.img;
    if (item.imageFile) {
      currentImg = await uploadAndCleanStorage({
        bucketName: "services-images",
        newFile: item.imageFile,
        oldUrl: item.id ? item.img : null,
      });
    }
    processedItems.push({
      vi: item.vi || "",
      en: item.en || "",
      img: currentImg || "",
      order: i,
    });
  }
  const existingConfig = await prisma.servicesConfig.findFirst();
  if (existingConfig) {
    await prisma.$transaction([
      prisma.serviceItem.deleteMany({
        where: { servicesConfigId: existingConfig.id },
      }),
      prisma.servicesConfig.update({
        where: { id: existingConfig.id },
        data: { titleVi, titleEn, items: { create: processedItems } },
      }),
    ]);
  } else {
    await prisma.servicesConfig.create({
      data: { titleVi, titleEn, items: { create: processedItems } },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateRecommendationsAction(
  formData: FormData,
  itemsList: RecommendationItemParam[],
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const subtitle = (formData.get("subtitle") as string) || "";
  const descVi = (formData.get("descVi") as string) || "";

  const processedItems = [];
  for (let i = 0; i < itemsList.length; i++) {
    const item = itemsList[i];
    let currentAvatar = item.avatar;
    if (item.imageFile) {
      currentAvatar = await uploadAndCleanStorage({
        bucketName: "recommendation-avatars",
        newFile: item.imageFile,
        oldUrl: item.id ? item.avatar : null,
      });
    }
    processedItems.push({
      name: item.name || "",
      roleLine1: item.roleLine1 || "",
      roleLine2: item.roleLine2 || "",
      timeAgo: item.timeAgo || "",
      quote: item.quote || "",
      avatar: currentAvatar || "",
      order: i,
    });
  }

  const existingConfig = await prisma.recommendationsConfig.findFirst();
  if (existingConfig) {
    await prisma.$transaction([
      prisma.recommendationItem.deleteMany({
        where: { recommendationsConfigId: existingConfig.id },
      }),
      prisma.recommendationsConfig.update({
        where: { id: existingConfig.id },
        data: { titleVi, subtitle, descVi, items: { create: processedItems } },
      }),
    ]);
  } else {
    await prisma.recommendationsConfig.create({
      data: { titleVi, subtitle, descVi, items: { create: processedItems } },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateMediaAction(
  formData: FormData,
  countriesList: CountryParam[],
  highlightsList: HighlightParam[],
  tvList: TvParam[],
  pressList: PressParam[],
  mapFile: File | null,
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const descVi = (formData.get("descVi") as string) || "";
  const descEn = (formData.get("descEn") as string) || "";
  const existingMedia = await prisma.mediaConfig.findFirst();
  const currentMapUrl = await uploadAndCleanStorage({
    bucketName: "media-core",
    newFile: mapFile,
    oldUrl: existingMedia?.mapImg,
  });
  const finalCountries = [];
  for (let i = 0; i < countriesList.length; i++) {
    const item = countriesList[i];
    let url = item.flag;
    if (item.imageFile) {
      url = await uploadAndCleanStorage({
        bucketName: "media-flags",
        newFile: item.imageFile,
        oldUrl: item.id ? item.flag : null,
      });
    }
    finalCountries.push({
      vi: item.vi,
      en: item.en,
      flag: url || "",
      order: i,
    });
  }
  const finalHighlights = [];
  for (let i = 0; i < highlightsList.length; i++) {
    const item = highlightsList[i];
    let url = item.img;
    if (item.imageFile) {
      url = await uploadAndCleanStorage({
        bucketName: "media-highlights",
        newFile: item.imageFile,
        oldUrl: item.id ? item.img : null,
      });
    }
    finalHighlights.push({
      titleVi: item.titleVi,
      titleEn: item.titleEn,
      img: url || "",
      href: item.href || "#",
      order: i,
    });
  }
  const finalTv = [];
  for (let i = 0; i < tvList.length; i++) {
    const item = tvList[i];
    let url = item.src;
    if (item.imageFile) {
      url = await uploadAndCleanStorage({
        bucketName: "media-tv",
        newFile: item.imageFile,
        oldUrl: item.id ? item.src : null,
      });
    }
    finalTv.push({ src: url || "", order: i });
  }
  const finalPress = [];
  for (let i = 0; i < pressList.length; i++) {
    const item = pressList[i];
    let lUrl = item.logo;
    let aUrl = item.article;
    if (item.logoFile) {
      lUrl = await uploadAndCleanStorage({
        bucketName: "media-press",
        newFile: item.logoFile,
        oldUrl: item.id ? item.logo : null,
      });
    }
    if (item.articleFile) {
      aUrl = await uploadAndCleanStorage({
        bucketName: "media-press",
        newFile: item.articleFile,
        oldUrl: item.id ? item.article : null,
      });
    }
    finalPress.push({ logo: lUrl || "", article: aUrl || "", order: i });
  }
  if (existingMedia) {
    await prisma.$transaction([
      prisma.mediaCountry.deleteMany({
        where: { mediaConfigId: existingMedia.id },
      }),
      prisma.mediaHighlight.deleteMany({
        where: { mediaConfigId: existingMedia.id },
      }),
      prisma.mediaTvStation.deleteMany({
        where: { mediaConfigId: existingMedia.id },
      }),
      prisma.mediaPressItem.deleteMany({
        where: { mediaConfigId: existingMedia.id },
      }),
      prisma.mediaConfig.update({
        where: { id: existingMedia.id },
        data: {
          titleVi,
          titleEn,
          descVi,
          descEn,
          mapImg: currentMapUrl,
          countries: { create: finalCountries },
          highlights: { create: finalHighlights },
          tvStations: { create: finalTv },
          pressItems: { create: finalPress },
        },
      }),
    ]);
  } else {
    await prisma.mediaConfig.create({
      data: {
        titleVi,
        titleEn,
        descVi,
        descEn,
        mapImg: currentMapUrl,
        countries: { create: finalCountries },
        highlights: { create: finalHighlights },
        tvStations: { create: finalTv },
        pressItems: { create: finalPress },
      },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateArticlesAction(
  formData: FormData,
  categoriesList: ArticleCategoryParam[],
  articlesList: ArticleItemParam[],
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const descVi = (formData.get("descVi") as string) || "";
  const descEn = (formData.get("descEn") as string) || "";

  await prisma.$transaction(async (tx) => {
    const existingConfig = await tx.articlesConfig.findFirst();
    if (existingConfig) {
      await tx.articlesConfig.update({
        where: { id: existingConfig.id },
        data: { titleVi, titleEn, descVi, descEn },
      });
    } else {
      await tx.articlesConfig.create({
        data: { titleVi, titleEn, descVi, descEn },
      });
    }

    const validCategoryIds = categoriesList
      .map((c) => c.id)
      .filter(
        (id): id is string =>
          typeof id === "string" &&
          id.length > 0 &&
          !id.startsWith("temp-") &&
          !id.startsWith("cat-"),
      );

    await tx.articleCategory.deleteMany({
      where: {
        id: { notIn: validCategoryIds },
      },
    });

    const keyToRealId: Record<string, string> = {};

    for (let i = 0; i < categoriesList.length; i++) {
      const cat = categoriesList[i];
      const clientKey = cat.id || `temp-${i}`;

      if (cat.id && !cat.id.startsWith("temp-") && !cat.id.startsWith("cat-")) {
        const updated = await tx.articleCategory.upsert({
          where: { id: cat.id },
          update: { vi: cat.vi || "", en: cat.en || "", order: i },
          create: { id: cat.id, vi: cat.vi || "", en: cat.en || "", order: i },
        });
        keyToRealId[clientKey] = updated.id;
      } else {
        const created = await tx.articleCategory.create({
          data: { vi: cat.vi || "", en: cat.en || "", order: i },
        });
        keyToRealId[clientKey] = created.id;
      }
    }

    const processedArticles = [];
    for (let i = 0; i < articlesList.length; i++) {
      const item = articlesList[i];

      let currentImg = item.img;
      if (item.imageFile) {
        currentImg = await uploadAndCleanStorage({
          bucketName: "article-images",
          newFile: item.imageFile,
          oldUrl: item.id ? item.img : null,
        });
      }

      const processedPages = [];
      for (let p = 0; p < item.pages.length; p++) {
        const page = item.pages[p];
        let pageSrc = page.src;
        if (page.imageFile) {
          pageSrc = await uploadAndCleanStorage({
            bucketName: "article-pages",
            newFile: page.imageFile,
            oldUrl: page.id ? page.src : null,
          });
        }
        processedPages.push({ src: pageSrc || "", order: p });
      }

      const categoryCreates = (item.categoryIds || [])
        .map((key) => keyToRealId[key] || key)
        .filter(Boolean)
        .map((realId) => ({
          category: {
            connect: { id: realId },
          },
        }));

      processedArticles.push({
        row: item.row,
        title: item.title || "",
        description: item.description || "",
        categories: {
          create: categoryCreates,
        },
        date: item.date || "",
        publisher: item.publisher || "",
        link: item.link || "#",
        img: currentImg || "",
        order: i,
        pages: { create: processedPages },
      });
    }

    await tx.article.deleteMany({});
    for (const data of processedArticles) {
      await tx.article.create({ data });
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateConnectTrainingAction(
  formData: FormData,
  programsList: ProgramParam[],
  socialsList: SocialParam[],
  logoFile: File | null,
) {
  const trainingTitleVi = (formData.get("trainingTitleVi") as string) || "";
  const trainingTitleEn = (formData.get("trainingTitleEn") as string) || "";
  const connectTitleVi = (formData.get("connectTitleVi") as string) || "";
  const connectTitleEn = (formData.get("connectTitleEn") as string) || "";
  const fanpageTitle = (formData.get("fanpageTitle") as string) || "";
  const fanpageUrl = (formData.get("fanpageUrl") as string) || "";
  const existingConfig = await prisma.connectTrainingConfig.findFirst();
  const currentLogoUrl = await uploadAndCleanStorage({
    bucketName: "media-core",
    newFile: logoFile,
    oldUrl: existingConfig?.logoIcon,
  });
  const finalPrograms = [];
  for (let i = 0; i < programsList.length; i++) {
    const item = programsList[i];
    let url = item.icon;
    if (item.imageFile) {
      url = await uploadAndCleanStorage({
        bucketName: "training-icons",
        newFile: item.imageFile,
        oldUrl: item.id ? item.icon : null,
      });
    }
    finalPrograms.push({
      vi: item.vi || "",
      en: item.en || "",
      icon: url || "",
      order: i,
    });
  }
  const finalSocials = [];
  for (let i = 0; i < socialsList.length; i++) {
    const item = socialsList[i];
    let url = item.iconImg;
    if (item.imageFile) {
      url = await uploadAndCleanStorage({
        bucketName: "social-icons",
        newFile: item.imageFile,
        oldUrl: item.id ? item.iconImg : null,
      });
    }
    finalSocials.push({
      titleVi: item.titleVi || "",
      titleEn: item.titleEn || "",
      linkText: item.linkText || "",
      url: item.url || "",
      bgColor: item.bgColor || "#1877F2",
      iconImg: url || "",
      order: i,
    });
  }
  if (existingConfig) {
    await prisma.$transaction([
      prisma.trainingProgram.deleteMany({
        where: { connectTrainingConfigId: existingConfig.id },
      }),
      prisma.socialLink.deleteMany({
        where: { connectTrainingConfigId: existingConfig.id },
      }),
      prisma.connectTrainingConfig.update({
        where: { id: existingConfig.id },
        data: {
          trainingTitleVi,
          trainingTitleEn,
          connectTitleVi,
          connectTitleEn,
          fanpageTitle,
          fanpageUrl,
          logoIcon: currentLogoUrl,
          programs: { create: finalPrograms },
          socials: { create: finalSocials },
        },
      }),
    ]);
  } else {
    await prisma.connectTrainingConfig.create({
      data: {
        trainingTitleVi,
        trainingTitleEn,
        connectTitleVi,
        connectTitleEn,
        fanpageTitle,
        fanpageUrl,
        logoIcon: currentLogoUrl,
        programs: { create: finalPrograms },
        socials: { create: finalSocials },
      },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateActivityAction(
  formData: FormData,
  activityList: ActivityItemParam[],
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const processedImages = [];
  for (let i = 0; i < activityList.length; i++) {
    const item = activityList[i];
    let currentSrc = item.src;
    if (item.imageFile) {
      currentSrc = await uploadAndCleanStorage({
        bucketName: "activity-images",
        newFile: item.imageFile,
        oldUrl: item.id ? item.src : null,
      });
    }
    processedImages.push({ src: currentSrc || "", order: i });
  }
  const existingConfig = await prisma.activityConfig.findFirst();
  if (existingConfig) {
    await prisma.$transaction([
      prisma.activityImage.deleteMany({
        where: { activityConfigId: existingConfig.id },
      }),
      prisma.activityConfig.update({
        where: { id: existingConfig.id },
        data: { titleVi, titleEn, items: { create: processedImages } },
      }),
    ]);
  } else {
    await prisma.activityConfig.create({
      data: { titleVi, titleEn, items: { create: processedImages } },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateClientsAction(
  formData: FormData,
  tabsList: TabItemParam[],
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const footerVi = (formData.get("footerVi") as string) || "";
  const footerEn = (formData.get("footerEn") as string) || "";

  const existingConfig = await prisma.clientConfig.findFirst();
  let configId = existingConfig?.id;

  if (existingConfig) {
    await prisma.clientConfig.update({
      where: { id: existingConfig.id },
      data: { titleVi, titleEn, footerVi, footerEn },
    });
  } else {
    const created = await prisma.clientConfig.create({
      data: { titleVi, titleEn, footerVi, footerEn },
    });
    configId = created.id;
  }

  await prisma.clientTab.deleteMany({ where: { clientConfigId: configId } });

  for (let t = 0; t < tabsList.length; t++) {
    const inputTab = tabsList[t];

    const createdTab = await prisma.clientTab.create({
      data: {
        tabKey: inputTab.tabKey,
        vi: inputTab.vi,
        en: inputTab.en,
        order: t,
        clientConfigId: configId!,
      },
    });

    const processedLogos = [];
    for (let l = 0; l < inputTab.logos.length; l++) {
      const logoItem = inputTab.logos[l];
      let finalSrc = logoItem.src;

      if (logoItem.imageFile) {
        finalSrc = await uploadAndCleanStorage({
          bucketName: "client-logos",
          newFile: logoItem.imageFile,
          oldUrl: logoItem.id ? logoItem.src : null,
        });
      }

      processedLogos.push({
        src: finalSrc || "",
        order: l,
        clientTabId: createdTab.id,
      });
    }

    if (processedLogos.length > 0) {
      await prisma.clientLogo.createMany({ data: processedLogos });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
