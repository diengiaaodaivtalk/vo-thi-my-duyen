"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { CountryParam, HighlightParam, TvParam, PressParam } from "../types";

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
