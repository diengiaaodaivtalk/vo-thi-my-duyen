"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { ProfileItemParam } from "../types";

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
