"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { RecommendationItemParam } from "../types";

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
