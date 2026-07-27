import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = "https://www.vothimyduyen.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];

  const events = await prisma.eventItem.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { order: "asc" },
  });

  const eventRoutes = events.map((event) => ({
    url: `${siteUrl}/su-kien/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...eventRoutes];
}
