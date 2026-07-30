import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RichContentRenderer } from "./_components/RichContentRenderer";
import { ArticleSidebar } from "./_components/ArticleSidebar";
import { ArrowRight, Clock, Clock12, Calendar } from "lucide-react";
import { getSiteCtaConfig } from "@/app/admin/events/queries";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.vothimyduyen.com";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.eventItem.findUnique({ where: { slug } });
  if (!event) return {};

  const title = event.metaTitle || event.titleVi;
  const description = event.metaDescription || event.excerptVi || undefined;
  const pageUrl = `${SITE_URL}/su-kien/${event.slug}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    authors: event.authorName ? [{ name: event.authorName }] : undefined,
    keywords: event.categoryVi ? [event.categoryVi, event.titleVi] : undefined,
    robots: event.published
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "article",
      url: pageUrl,
      title,
      description,
      siteName: "Võ Thị Mỹ Duyên",
      locale: "vi_VN",
      images: event.coverImg
        ? [
            {
              url: event.coverImg,
              width: 1200,
              height: 800,
              alt: event.titleVi,
            },
          ]
        : undefined,
      publishedTime: event.createdAt.toISOString(),
      modifiedTime: event.updatedAt.toISOString(),
      authors: event.authorName ? [event.authorName] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: event.coverImg ? [event.coverImg] : undefined,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.eventItem.findUnique({ where: { slug } });

  if (!event || !event.published) notFound();

  const related = await prisma.eventItem.findMany({
    where: { published: true, id: { not: event.id } },
    orderBy: { order: "asc" },
    take: 3,
  });

  const cta = await getSiteCtaConfig();

  return (
    <div className="bg-[#fbfaf7]">
      <div className="max-w-6xl mx-auto px-6 py-8 lg:py-10">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 overflow-x-auto whitespace-nowrap py-2">
          <Link href="/" className="hover:text-[#c29b57] shrink-0">
            Trang chủ
          </Link>
          <span className="shrink-0">›</span>
          <span className="shrink-0">Bài viết</span>
          <span className="shrink-0">›</span>
          <span className="text-gray-800">{event.titleVi}</span>
        </div>

        {event.categoryVi && (
          <span className="inline-block border border-[#c29b57] text-[#8a6a3f] text-[11px] tracking-wide px-3 py-1.5 rounded mb-4">
            {event.categoryVi.toUpperCase()}
          </span>
        )}

        <h1
          className="text-3xl sm:text-4xl font-bold text-[#0a1b35] leading-tight mb-4 max-w-3xl"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          {event.titleVi}
        </h1>

        {event.excerptVi && (
          <p className="text-base text-gray-500 leading-relaxed mb-6 max-w-3xl">
            {event.excerptVi}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#efe7d8] text-[#8a6a3f] font-bold flex items-center justify-center overflow-hidden">
              {event.authorAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.authorAvatar}
                  alt={event.authorName || ""}
                  className="w-full h-full object-cover"
                />
              ) : (
                event.authorName?.trim().slice(-1) || "D"
              )}
            </div>
            <div>
              <p className="text-[#0a1b35] font-semibold">{event.authorName}</p>
              <p>{event.authorRole}</p>
            </div>
          </div>
          <div className="mx-3 h-6 w-[0.25px] bg-gray-200"></div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              {event.eventDate}
            </div>
            <div> · </div>
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              {event.eventTime}
            </div>
            <div> · </div>
            <div className="flex items-center gap-1">
              <Clock12 className="size-3" />
              {event.readTime}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start">
          <div className="min-w-0">
            {event.coverImg && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-10">
                <Image
                  src={event.coverImg}
                  alt={event.titleVi}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <RichContentRenderer html={event.contentHtmlVi || ""} />
          </div>

          <div className="sticky top-24">
            <ArticleSidebar
              categoryVi={event.categoryVi}
              eventDate={event.eventDate}
              eventTime={event.eventTime}
              readTime={event.readTime}
              authorName={event.authorName}
              authorRole={event.authorRole}
              authorAvatar={event.authorAvatar}
              authorBio={event.authorBio}
              ctaLabel={event.ctaLabel}
              ctaHref={event.ctaHref}
            />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <h4
              className="text-2xl 2xl:text-3xl font-bold text-[#0a1b35] text-center mb-8"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              BÀI VIẾT LIÊN QUAN
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/su-kien/${r.slug}`}
                  className="group bg-white border border-[#efeae0] rounded-xl hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full aspect-3/2">
                      {r.coverImg && (
                        <div className="w-full h-full rounded-t-xl overflow-hidden relative">
                          <Image
                            src={r.coverImg}
                            alt={r.titleVi}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {r.categoryVi && (
                        <div className="absolute -bottom-2 left-4 z-10">
                          <span className="bg-[#c29b57] text-black text-[8px] font-semibold uppercase px-2.5 py-1 rounded-sm">
                            {r.categoryVi}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-4 pt-5 pb-2">
                      <h5 className="text-sm font-bold text-[#0a1b35] leading-snug line-clamp-2 group-hover:text-[#c29b57] transition-colors">
                        {r.titleVi}
                      </h5>
                    </div>
                  </div>

                  <div className="px-4 pb-4 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span>{r.eventDate}</span>
                      {r.readTime && (
                        <>
                          <span>•</span>
                          <span>{r.readTime}</span>
                        </>
                      )}
                    </div>

                    <span className="text-[#c29b57] group-hover:translate-x-1 transition-transform">
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 space-y-6">
          <div className="relative bg-white border border-[#efeae0] rounded-lg p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            <div className="max-w-xl z-10">
              <h3
                className="text-xl md:text-2xl font-bold text-[#0a1b35] mb-2 leading-tight"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {cta.primaryTitle}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                {cta.primaryDesc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-col items-center gap-3 w-full md:w-auto z-10 shrink-0 min-w-50">
              <Link
                href={cta.primaryBtn1Href || "#"}
                target="_blank"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#c29b57] text-white px-6 py-3 rounded-lg text-xs font-bold hover:bg-[#a88344] transition-colors uppercase tracking-wider"
              >
                {cta.primaryBtn1Label}
              </Link>
              <Link
                href={cta.primaryBtn2Href || "#"}
                target="_blank"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#0a1b35] border border-gray-300 px-6 py-3 rounded-lg text-xs font-bold hover:bg-[#fbfaf7] transition-colors uppercase tracking-wider"
              >
                {cta.primaryBtn2Label}
              </Link>
            </div>
          </div>

          <div className="bg-[#0b131f] rounded-lg p-5 md:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#c29b57]/40 bg-[#121c2d] flex items-center justify-center text-[#c29b57] shrink-0">
                <Calendar className="size-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#d2b174] uppercase">
                  {cta.secondaryTitle}
                </h4>
                <p className="text-sm text-gray-400 mt-0.5">
                  {cta.secondaryDesc}
                </p>
              </div>
            </div>

            <Link
              href={cta.secondaryBtnHref || "#"}
              target="_blank"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-[#d2b174] text-[#0a1b35] px-6 py-3 rounded-lg text-xs font-bold hover:bg-[#c29b57] transition-colors shrink-0 uppercase tracking-wider"
            >
              {cta.secondaryBtnLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const events = await prisma.eventItem.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return events.map((e) => ({ slug: e.slug }));
}
