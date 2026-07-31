import { prisma } from "@/lib/prisma";

export async function getPublishedArticlesData() {
  const [config, categories, articles] = await Promise.all([
    prisma.articlesConfig.findFirst(),
    prisma.articleCategory.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.article.findMany({
      orderBy: { order: "asc" },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        pages: {
          orderBy: { order: "asc" },
        },
      },
    }),
  ]);

  type ArticleWithRelations = (typeof articles)[number];

  const mapArticle = (a: ArticleWithRelations) => ({
    id: a.id,
    title: a.title || "",
    description: a.description || "",
    categoryIds: a.categories.map((c) => c.categoryId),
    categories: a.categories.map((c) => ({
      id: c.category.id,
      vi: c.category.vi || "",
      en: c.category.en || "",
    })),
    date: a.date || "",
    publisher: a.publisher || "",
    link: a.link || "#",
    img: a.img || "",
    pages: a.pages
      .map((p) => p.src)
      .filter((src): src is string => Boolean(src)),
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
