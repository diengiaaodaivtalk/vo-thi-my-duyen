import { prisma } from "@/lib/prisma";

export async function getConnectTrainingData() {
  const connectTrainingConfig = await prisma.connectTrainingConfig.findFirst({
    include: {
      programs: { orderBy: { order: "asc" } },
      socials: { orderBy: { order: "asc" } },
    },
  });

  return connectTrainingConfig
    ? {
        id: connectTrainingConfig.id,
        trainingTitleVi: connectTrainingConfig.trainingTitleVi || "",
        trainingTitleEn: connectTrainingConfig.trainingTitleEn || "",
        connectTitleVi: connectTrainingConfig.connectTitleVi || "",
        connectTitleEn: connectTrainingConfig.connectTitleEn || "",
        fanpageTitle: connectTrainingConfig.fanpageTitle || "",
        fanpageUrl: connectTrainingConfig.fanpageUrl || "",
        logoIcon: connectTrainingConfig.logoIcon || "",
        programs: connectTrainingConfig.programs.map((i) => ({
          id: i.id,
          vi: i.vi || "",
          en: i.en || "",
          icon: i.icon || "",
        })),
        socials: connectTrainingConfig.socials.map((i) => ({
          id: i.id,
          titleVi: i.titleVi || "",
          titleEn: i.titleEn || "",
          linkText: i.linkText || "",
          url: i.url || "",
          bgColor: i.bgColor || "#1877F2",
          iconImg: i.iconImg || "",
        })),
      }
    : null;
}
