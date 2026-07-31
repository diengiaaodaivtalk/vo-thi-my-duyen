import { prisma } from "@/lib/prisma";

export async function getClientsData() {
  const clientConfig = await prisma.clientConfig.findFirst({
    include: {
      tabs: {
        orderBy: { order: "asc" },
        include: { logos: { orderBy: { order: "asc" } } },
      },
    },
  });

  return clientConfig
    ? {
        id: clientConfig.id,
        titleVi: clientConfig.titleVi || "KHÁCH HÀNG CHIẾN LƯỢC",
        titleEn: clientConfig.titleEn || "STRATEGIC CLIENTS",
        footerVi: clientConfig.footerVi || "",
        footerEn: clientConfig.footerEn || "",
        tabs: clientConfig.tabs.map((t) => ({
          id: t.id,
          tabKey: t.tabKey,
          vi: t.vi || "",
          en: t.en || "",
          logos: t.logos.map((l) => ({ id: l.id, src: l.src || "" })),
        })),
      }
    : null;
}
