"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { ExpertiseItemParam } from "../types";

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
