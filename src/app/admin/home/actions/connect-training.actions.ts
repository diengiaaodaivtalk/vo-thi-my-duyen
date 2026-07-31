"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { ProgramParam, SocialParam } from "../types";

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
