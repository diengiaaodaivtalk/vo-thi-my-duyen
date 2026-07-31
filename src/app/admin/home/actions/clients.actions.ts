"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { TabItemParam } from "../types";

export async function updateClientsAction(
  formData: FormData,
  tabsList: TabItemParam[],
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const footerVi = (formData.get("footerVi") as string) || "";
  const footerEn = (formData.get("footerEn") as string) || "";

  const existingConfig = await prisma.clientConfig.findFirst();
  let configId = existingConfig?.id;

  if (existingConfig) {
    await prisma.clientConfig.update({
      where: { id: existingConfig.id },
      data: { titleVi, titleEn, footerVi, footerEn },
    });
  } else {
    const created = await prisma.clientConfig.create({
      data: { titleVi, titleEn, footerVi, footerEn },
    });
    configId = created.id;
  }

  await prisma.clientTab.deleteMany({ where: { clientConfigId: configId } });

  for (let t = 0; t < tabsList.length; t++) {
    const inputTab = tabsList[t];

    const createdTab = await prisma.clientTab.create({
      data: {
        tabKey: inputTab.tabKey,
        vi: inputTab.vi,
        en: inputTab.en,
        order: t,
        clientConfigId: configId!,
      },
    });

    const processedLogos = [];
    for (let l = 0; l < inputTab.logos.length; l++) {
      const logoItem = inputTab.logos[l];
      let finalSrc = logoItem.src;

      if (logoItem.imageFile) {
        finalSrc = await uploadAndCleanStorage({
          bucketName: "client-logos",
          newFile: logoItem.imageFile,
          oldUrl: logoItem.id ? logoItem.src : null,
        });
      }

      processedLogos.push({
        src: finalSrc || "",
        order: l,
        clientTabId: createdTab.id,
      });
    }

    if (processedLogos.length > 0) {
      await prisma.clientLogo.createMany({ data: processedLogos });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
