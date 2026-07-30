import { prisma } from "@/lib/prisma";

export async function getPublishedArticlesData() {
  const [config, categories, articles] = await Promise.all([
    prisma.articlesConfig.findFirst(),
    prisma.articleCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.article.findMany({
      orderBy: { order: "asc" },
      include: { pages: { orderBy: { order: "asc" } } },
    }),
  ]);

  const mapArticle = (a: (typeof articles)[number]) => ({
    id: a.id,
    title: a.title || "",
    description: a.description || "",
    categoryId: a.categoryId || "",
    date: a.date || "",
    publisher: a.publisher || "",
    link: a.link || "#",
    img: a.img || "",
    pages: a.pages.map((p) => p.src || ""),
  });

  return {
    titleVi: config?.titleVi || "",
    titleEn: config?.titleEn || "",
    descVi: config?.descVi || "",
    descEn: config?.descEn || "",
    categories: categories.map((c) => ({
      id: c.id,
      vi: c.vi || "",
      en: c.en || "",
    })),
    row1Articles: articles.filter((a) => a.row === 1).map(mapArticle),
    row2Articles: articles.filter((a) => a.row === 2).map(mapArticle),
  };
}
