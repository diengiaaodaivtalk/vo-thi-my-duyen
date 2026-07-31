"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { ServiceItemParam } from "../types";

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
