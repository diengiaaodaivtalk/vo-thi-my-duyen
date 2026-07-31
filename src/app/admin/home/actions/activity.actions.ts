"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { ActivityItemParam } from "../types";

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
