import { prisma } from "@/lib/prisma";

export async function getCertificatesData() {
  const certificatesConfig = await prisma.certificatesConfig.findFirst({
    include: { items: { orderBy: { order: "asc" } } },
  });

  return certificatesConfig
    ? {
        id: certificatesConfig.id,
        titleVi: certificatesConfig.titleVi || "CHỨNG NHẬN",
        titleEn: certificatesConfig.titleEn || "CERTIFICATES & AWARDS",
        descVi: certificatesConfig.descVi || "",
        descEn: certificatesConfig.descEn || "",
        buttonText: certificatesConfig.buttonText || "Xem tất cả chứng nhận",
        buttonHref: certificatesConfig.buttonHref || "#",
        items: certificatesConfig.items.map((item) => ({
          id: item.id,
          img: item.img || "",
          originalImg: item.img || "",
        })),
      }
    : null;
}
