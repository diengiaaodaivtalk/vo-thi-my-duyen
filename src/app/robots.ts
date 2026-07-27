import { MetadataRoute } from "next";

const siteUrl = "https://www.vothimyduyen.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
