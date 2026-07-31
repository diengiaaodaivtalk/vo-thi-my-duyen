"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { StatItemParam } from "../types";

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
