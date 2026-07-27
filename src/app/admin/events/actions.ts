"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/slugify";
import { uploadAndCleanStorage } from "@/utils/supabase/storage";

async function ensureConfig() {
  const existing = await prisma.eventsConfig.findFirst();
  if (existing) return existing;
  return prisma.eventsConfig.create({
    data: { titleVi: "HOẠT ĐỘNG & SỰ KIỆN", titleEn: "ACTIVITIES & EVENTS" },
  });
}

export async function updateEventsSectionTitleAction(formData: FormData) {
  const titleVi = (formData.get("titleVi") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || "";
  const config = await ensureConfig();
  await prisma.eventsConfig.update({
    where: { id: config.id },
    data: { titleVi, titleEn },
  });
  revalidatePath("/");
  revalidatePath("/admin/events");
}

export async function createEventAction() {
  const config = await ensureConfig();
  const count = await prisma.eventItem.count({
    where: { eventsConfigId: config.id },
  });
  const created = await prisma.eventItem.create({
    data: {
      slug: `bai-viet-moi-${Date.now()}`,
      titleVi: "Bài viết mới",
      eventsConfigId: config.id,
      order: count,
      published: false,
    },
  });
  revalidatePath("/admin/events");
  redirect(`/admin/events/${created.id}`);
}

export async function deleteEventAction(id: string) {
  await prisma.eventItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/events");
}

export async function reorderEventsAction(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.eventItem.update({ where: { id }, data: { order: index } }),
    ),
  );
  revalidatePath("/");
  revalidatePath("/admin/events");
}

interface UpdateEventInput {
  id: string;
  categoryVi: string;
  categoryEn: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  eventDate: string;
  eventTime: string;
  authorName: string;
  authorRole: string;
  authorBio: string;
  readTime: string;
  published: boolean;
  contentHtmlVi: string;
  contentHtmlEn: string;
  metaTitle: string;
  metaDescription: string;
  ctaLabel: string;
  ctaHref: string;
}

export async function updateEventAction(
  input: UpdateEventInput,
  coverFile: File | null,
  avatarFile: File | null,
) {
  const existing = await prisma.eventItem.findUnique({
    where: { id: input.id },
  });
  if (!existing) throw new Error("Không tìm thấy bài viết");

  const currentCover = await uploadAndCleanStorage({
    bucketName: "events-images",
    newFile: coverFile,
    oldUrl: existing.coverImg,
  });

  const currentAvatar = await uploadAndCleanStorage({
    bucketName: "events-author-avatars",
    newFile: avatarFile,
    oldUrl: existing.authorAvatar,
  });

  let slug = existing.slug;
  if (
    existing.titleVi !== input.titleVi ||
    existing.slug.startsWith("bai-viet-moi-")
  ) {
    const base = slugify(input.titleVi);
    let candidate = base;
    let i = 1;
    while (
      await prisma.eventItem.findFirst({
        where: { slug: candidate, id: { not: input.id } },
      })
    ) {
      candidate = `${base}-${i}`;
      i += 1;
    }
    slug = candidate;
  }

  await prisma.eventItem.update({
    where: { id: input.id },
    data: {
      slug,
      categoryVi: input.categoryVi,
      categoryEn: input.categoryEn,
      titleVi: input.titleVi,
      titleEn: input.titleEn,
      excerptVi: input.excerptVi,
      excerptEn: input.excerptEn,
      eventDate: input.eventDate,
      eventTime: input.eventTime,
      authorName: input.authorName,
      authorRole: input.authorRole,
      authorBio: input.authorBio,
      readTime: input.readTime,
      published: input.published,
      contentHtmlVi: input.contentHtmlVi,
      contentHtmlEn: input.contentHtmlEn,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      ctaLabel: input.ctaLabel,
      ctaHref: input.ctaHref,
      coverImg: currentCover,
      authorAvatar: currentAvatar,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/events");
  revalidatePath(`/su-kien/${slug}`);
  return { slug };
}

export async function uploadEditorImageAction(file: File) {
  const url = await uploadAndCleanStorage({
    bucketName: "events-content-images",
    newFile: file,
    oldUrl: null,
  });
  return url;
}

export async function updateSiteCtaAction(formData: FormData) {
  const data = {
    primaryTitle: (formData.get("primaryTitle") as string) || "",
    primaryDesc: (formData.get("primaryDesc") as string) || "",
    primaryBtn1Label: (formData.get("primaryBtn1Label") as string) || "",
    primaryBtn1Href: (formData.get("primaryBtn1Href") as string) || "",
    primaryBtn2Label: (formData.get("primaryBtn2Label") as string) || "",
    primaryBtn2Href: (formData.get("primaryBtn2Href") as string) || "",
    secondaryTitle: (formData.get("secondaryTitle") as string) || "",
    secondaryDesc: (formData.get("secondaryDesc") as string) || "",
    secondaryBtnLabel: (formData.get("secondaryBtnLabel") as string) || "",
    secondaryBtnHref: (formData.get("secondaryBtnHref") as string) || "",
  };

  const existing = await prisma.siteCtaConfig.findFirst();
  if (existing) {
    await prisma.siteCtaConfig.update({ where: { id: existing.id }, data });
  } else {
    await prisma.siteCtaConfig.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/su-kien", "layout");
  revalidatePath("/admin/events");
}
