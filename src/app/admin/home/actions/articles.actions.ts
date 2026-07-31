"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";
import { ArticleCategoryParam, ArticleItemParam } from "../types";

export async function updateArticlesAction(
  formData: FormData,
  categoriesList: ArticleCategoryParam[],
  articlesList: ArticleItemParam[],
) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const descVi = (formData.get("descVi") as string) || "";
  const descEn = (formData.get("descEn") as string) || "";

  await prisma.$transaction(async (tx) => {
    const existingConfig = await tx.articlesConfig.findFirst();
    if (existingConfig) {
      await tx.articlesConfig.update({
        where: { id: existingConfig.id },
        data: { titleVi, titleEn, descVi, descEn },
      });
    } else {
      await tx.articlesConfig.create({
        data: { titleVi, titleEn, descVi, descEn },
      });
    }

    const validCategoryIds = categoriesList
      .map((c) => c.id)
      .filter(
        (id): id is string =>
          typeof id === "string" &&
          id.length > 0 &&
          !id.startsWith("temp-") &&
          !id.startsWith("cat-"),
      );

    await tx.articleCategory.deleteMany({
      where: {
        id: { notIn: validCategoryIds },
      },
    });

    const keyToRealId: Record<string, string> = {};

    for (let i = 0; i < categoriesList.length; i++) {
      const cat = categoriesList[i];
      const clientKey = cat.id || `temp-${i}`;

      if (cat.id && !cat.id.startsWith("temp-") && !cat.id.startsWith("cat-")) {
        const updated = await tx.articleCategory.upsert({
          where: { id: cat.id },
          update: { vi: cat.vi || "", en: cat.en || "", order: i },
          create: { id: cat.id, vi: cat.vi || "", en: cat.en || "", order: i },
        });
        keyToRealId[clientKey] = updated.id;
      } else {
        const created = await tx.articleCategory.create({
          data: { vi: cat.vi || "", en: cat.en || "", order: i },
        });
        keyToRealId[clientKey] = created.id;
      }
    }

    const processedArticles = [];
    for (let i = 0; i < articlesList.length; i++) {
      const item = articlesList[i];

      let currentImg = item.img;
      if (item.imageFile) {
        currentImg = await uploadAndCleanStorage({
          bucketName: "article-images",
          newFile: item.imageFile,
          oldUrl: item.id ? item.img : null,
        });
      }

      const processedPages = [];
      for (let p = 0; p < item.pages.length; p++) {
        const page = item.pages[p];
        let pageSrc = page.src;
        if (page.imageFile) {
          pageSrc = await uploadAndCleanStorage({
            bucketName: "article-pages",
            newFile: page.imageFile,
            oldUrl: page.id ? page.src : null,
          });
        }
        processedPages.push({ src: pageSrc || "", order: p });
      }

      const categoryCreates = (item.categoryIds || [])
        .map((key) => keyToRealId[key] || key)
        .filter(Boolean)
        .map((realId) => ({
          category: {
            connect: { id: realId },
          },
        }));

      processedArticles.push({
        row: item.row,
        title: item.title || "",
        description: item.description || "",
        categories: {
          create: categoryCreates,
        },
        date: item.date || "",
        publisher: item.publisher || "",
        link: item.link || "#",
        img: currentImg || "",
        order: i,
        pages: { create: processedPages },
      });
    }

    await tx.article.deleteMany({});
    for (const data of processedArticles) {
      await tx.article.create({ data });
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
}
