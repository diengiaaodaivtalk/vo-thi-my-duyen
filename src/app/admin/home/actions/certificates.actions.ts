"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { CertificateItemParam } from "../types";

export async function updateCertificatesAction(
  formData: FormData,
  itemsList: CertificateItemParam[],
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const descVi = (formData.get("descVi") as string) || "";
  const descEn = (formData.get("descEn") as string) || "";
  const buttonText = (formData.get("buttonText") as string) || "";
  const buttonHref = (formData.get("buttonHref") as string) || "";

  const processedItems = [];
  for (let i = 0; i < itemsList.length; i++) {
    const item = itemsList[i];
    let currentImg = item.img;
    if (item.imageFile) {
      currentImg = await uploadAndCleanStorage({
        bucketName: "certificate-images",
        newFile: item.imageFile,
        oldUrl: item.id ? item.img : null,
      });
    }
    processedItems.push({ img: currentImg || "", order: i });
  }

  const existingConfig = await prisma.certificatesConfig.findFirst();
  if (existingConfig) {
    await prisma.$transaction([
      prisma.certificateItem.deleteMany({
        where: { certificatesConfigId: existingConfig.id },
      }),
      prisma.certificatesConfig.update({
        where: { id: existingConfig.id },
        data: {
          titleVi,
          titleEn,
          descVi,
          descEn,
          buttonText,
          buttonHref,
          items: { create: processedItems },
        },
      }),
    ]);
  } else {
    await prisma.certificatesConfig.create({
      data: {
        titleVi,
        titleEn,
        descVi,
        descEn,
        buttonText,
        buttonHref,
        items: { create: processedItems },
      },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin");
}
