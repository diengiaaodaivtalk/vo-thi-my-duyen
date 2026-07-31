import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const articleWithRelations = Prisma.validator<Prisma.ArticleDefaultArgs>()({
  include: {
    pages: { orderBy: { order: "asc" } },
    categories: { include: { category: true } },
  },
});
type ArticleWithRelations = Prisma.ArticleGetPayload<
  typeof articleWithRelations
>;

function mapArticle(a: ArticleWithRelations) {
  return {
    id: a.id,
    row: a.row,
    title: a.title || "",
    description: a.description || "",
    categoryIds: (a.categories || []).map(
      (item) => item.category?.id || item.categoryId || "",
    ),
    date: a.date || "",
    publisher: a.publisher || "",
    link: a.link || "#",
    img: a.img || "",
    pages: (a.pages || []).map((p) => ({ id: p.id, src: p.src || "" })),
  };
}

export async function getArticlesData() {
  const [articlesConfig, categories, articles] = await Promise.all([
    prisma.articlesConfig.findFirst(),
    prisma.articleCategory.findMany({ orderBy: { order: "asc" } }),
    prisma.article.findMany({
      orderBy: { order: "asc" },
      ...articleWithRelations,
    }),
  ]);

  return {
    titleVi: articlesConfig?.titleVi || "CÁC BÀI VIẾT ĐÃ XUẤT BẢN",
    titleEn: articlesConfig?.titleEn || "Published Articles",
    descVi: articlesConfig?.descVi || "",
    descEn: articlesConfig?.descEn || "",
    categories: categories.map((c) => ({
      id: c.id,
      vi: c.vi || "",
      en: c.en || "",
    })),
    row1: articles.filter((a) => a.row === 1).map(mapArticle),
    row2: articles.filter((a) => a.row === 2).map(mapArticle),
  };
}
