"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { ButtonParam } from "../types";

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
