"use client";

import { useState, useEffect, useCallback, CSSProperties } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";

export interface ArticleCategory {
  id: string;
  vi: string;
  en: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  categoryIds: string[];
  categories?: ArticleCategory[];
  date: string;
  publisher: string;
  link: string;
  img: string;
  pages: string[];
}

export interface PublishedArticlesClientProps {
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  categories: ArticleCategory[];
  row1Articles: Article[];
  row2Articles: Article[];
}

export function PublishedArticlesClient({
  titleVi,
  titleEn,
  descVi,
  descEn,
  categories,
  row1Articles,
  row2Articles,
}: PublishedArticlesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const filteredRow1 =
    selectedCategory === "all"
      ? row1Articles
      : row1Articles.filter((item) =>
          item.categoryIds?.includes(selectedCategory),
        );

  const filteredRow2 =
    selectedCategory === "all"
      ? row2Articles
      : row2Articles.filter((item) =>
          item.categoryIds?.includes(selectedCategory),
        );

  const handleReadArticle = (article: Article) => {
    if (!article.pages || article.pages.length === 0) {
      if (article.link) {
        window.open(article.link, "_blank", "noopener,noreferrer");
      }
      return;
    }
    setActiveArticle(article);
  };

  return (
    <section className="w-full bg-[#fbfbfa] px-6 lg:px-16 py-12 lg:py-16 overflow-hidden">
      <div className="mx-auto relative mb-8 lg:mb-10">
        <div className="flex flex-col items-center justify-center w-full gap-2 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1b35]">
            <span style={{ fontFamily: "var(--font-playfair), serif" }}>
              {titleVi}
            </span>
          </h2>
          <span className="text-gray-500 font-normal text-sm sm:text-base italic">
            {titleEn}
          </span>
          {descVi && (
            <p className="mt-2 text-[13px] sm:text-sm text-[#0a1b35]/80 max-w-2xl leading-relaxed">
              {descVi}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
              selectedCategory === "all"
                ? "bg-[#c29b57] text-white border-[#c29b57] shadow-sm"
                : "bg-white text-[#0a1b35] border-[#e2d5c3] hover:border-[#c29b57] hover:text-[#c29b57]"
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                  isActive
                    ? "bg-[#c29b57] text-white border-[#c29b57] shadow-sm"
                    : "bg-white text-[#0a1b35] border-[#e2d5c3] hover:border-[#c29b57] hover:text-[#c29b57]"
                }`}
              >
                {cat.vi}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:gap-6 w-full">
        <ArticleCarouselRow
          key={`row1-${selectedCategory}`}
          articles={filteredRow1}
          allCategories={categories}
          onRead={handleReadArticle}
        />
        <ArticleCarouselRow
          key={`row2-${selectedCategory}`}
          articles={filteredRow2}
          allCategories={categories}
          onRead={handleReadArticle}
        />
      </div>

      {activeArticle && (
        <FlipbookModal
          article={activeArticle}
          allCategories={categories}
          onClose={() => setActiveArticle(null)}
        />
      )}
    </section>
  );
}

function ArticleCarouselRow({
  articles,
  allCategories,
  onRead,
}: {
  articles: Article[];
  allCategories: ArticleCategory[];
  onRead: (article: Article) => void;
}) {
  const buildBase = (arr: Article[]) => {
    if (arr.length === 0) return [];
    let list: Article[] = [];
    while (list.length < 3) {
      list = [...list, ...arr];
    }
    return list;
  };

  const baseArticles = buildBase(articles);
  const baseLength = baseArticles.length;

  const [currentIndex, setCurrentIndex] = useState(baseLength);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const extendedArticles = [...baseArticles, ...baseArticles, ...baseArticles];

  const handlePrev = () => {
    if (!isTransitioning || baseLength === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!isTransitioning || baseLength === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (baseLength === 0) return;

    if (currentIndex === baseLength * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(baseLength);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (currentIndex === baseLength - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(baseLength * 2 - 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, baseLength]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  if (baseLength === 0) return null;

  return (
    <div className="relative w-full px-11 lg:px-13">
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 size-9 rounded-full border border-[#e2d5c3] bg-white text-[#0a1b35] hover:bg-[#c29b57] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
      >
        <ChevronLeft className="size-5" />
      </button>

      <div className="w-full overflow-hidden">
        <div
          style={
            {
              transform: `translateX(calc(-${currentIndex} * (100% + var(--gap-offset)) / var(--items-per-screen)))`,
              transition: isTransitioning
                ? "transform 300ms ease-in-out"
                : "none",
            } as CSSProperties
          }
          className="flex gap-4 md:gap-6 [--items-per-screen:1] [--gap-offset:16px] sm:[--items-per-screen:2] md:[--items-per-screen:2] md:[--gap-offset:24px] lg:[--items-per-screen:3]"
        >
          {extendedArticles.map((article, index) => (
            <ArticleCard
              key={`${article.id}-${index}`}
              article={article}
              allCategories={allCategories}
              onRead={() => onRead(article)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 size-9 rounded-full border border-[#e2d5c3] bg-white text-[#0a1b35] hover:bg-[#c29b57] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

function ArticleCard({
  article,
  allCategories,
  onRead,
}: {
  article: Article;
  allCategories: ArticleCategory[];
  onRead: () => void;
}) {
  const matchedCategories = article.categories?.length
    ? article.categories
    : allCategories.filter((c) => article.categoryIds?.includes(c.id));

  return (
    <div className="shrink-0 w-full sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/3)] bg-white rounded-lg border border-[#e2d5c3]/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative w-full aspect-video overflow-hidden mb-4">
        {article.img && (
          <Image
            src={article.img}
            alt={article.title}
            fill
            className="object-cover"
          />
        )}
        {matchedCategories[0] && (
          <div className="absolute bottom-3 left-3 bg-[#c29b57] text-white text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-md shadow-sm">
            {matchedCategories[0].vi}
          </div>
        )}
      </div>
      <div className="px-4 sm:px-5 pb-2 sm:pb-2">
        <h3
          className="text-base sm:text-lg font-bold text-[#0a1b35] line-clamp-2 leading-snug"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          <Link href={article.link} target="_blank">
            {article.title}
          </Link>
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-2 leading-relaxed">
          {article.description}
        </p>

        <div className="mt-2 pt-2 border-t border-[#e2d5c3]/50 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-gray-400 gap-2">
          <span className="line-clamp-1">
            {article.date} <span className="mx-1">|</span> {article.publisher}
          </span>
          <button
            onClick={onRead}
            className="shrink-0 border border-[#e2d5c3] text-[#0a1b35] hover:bg-[#c29b57] hover:border-[#c29b57] hover:text-white px-3 py-1 rounded-md transition-colors cursor-pointer"
          >
            Đọc bài viết
          </button>
        </div>
      </div>
    </div>
  );
}

function FlipbookModal({
  article,
  allCategories,
  onClose,
}: {
  article: Article;
  allCategories: ArticleCategory[];
  onClose: () => void;
}) {
  const pages =
    article.pages.length > 0 ? article.pages : [article.img, article.img];

  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDoublePage, setIsDoublePage] = useState(true);

  const step = isDoublePage ? 2 : 1;
  const totalPages = pages.length;

  const matchedCategories = article.categories?.length
    ? article.categories
    : allCategories.filter((c) => article.categoryIds?.includes(c.id));

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(0, prev - step));
  }, [step]);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => {
      if (prev + step >= totalPages) return prev;
      return prev + step;
    });
  }, [step, totalPages]);

  useEffect(() => {
    const handleResize = () => {
      setIsDoublePage(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevPage();
      if (e.key === "ArrowRight") handleNextPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextPage, handlePrevPage, onClose]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const leftPageIndex = currentPage;
  const rightPageIndex = isDoublePage ? currentPage + 1 : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md p-2 sm:p-8">
      <div className="relative w-full h-full max-h-[90vh] flex flex-col bg-[#0a1b35] rounded-2xl overflow-hidden shadow-2xl border border-[#e2d5c3]/30">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#0a1b35] border-b border-[#e2d5c3]/20 text-white">
          <div className="flex items-center gap-2 truncate pr-4">
            {matchedCategories[0] && (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#c29b57] text-white shrink-0">
                {matchedCategories[0].vi}
              </span>
            )}
            <h3
              className="text-sm sm:text-base font-bold text-white truncate"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {article.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <ZoomOut className="size-4" />
              </button>
              <span className="text-xs px-1 text-white/70 font-mono">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <ZoomIn className="size-4" />
              </button>
            </div>

            <div className="text-xs text-white/70 px-2 py-1 bg-white/10 rounded-lg font-mono">
              {isDoublePage
                ? `${leftPageIndex + 1}${
                    rightPageIndex && rightPageIndex < totalPages
                      ? `-${rightPageIndex + 1}`
                      : ""
                  } / ${totalPages}`
                : `${leftPageIndex + 1} / ${totalPages}`}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-[#c29b57] text-white transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 bg-[#15243b] overflow-hidden flex items-center justify-center p-2 sm:p-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 size-8 sm:size-10 rounded-full bg-gray-800 hover:bg-[#c29b57] disabled:opacity-30 disabled:hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>

          <div
            className="flex items-center justify-center transition-transform duration-200 ease-out max-w-full"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <div className="relative flex bg-white shadow-2xl rounded-lg overflow-hidden border border-[#e2d5c3]/40 max-h-[60vh] sm:max-h-[70vh] max-w-full">
              <div className="relative w-[calc(100vw-5rem)] max-w-[320px] sm:w-100 md:w-112.5 aspect-3/4 bg-neutral-100 flex items-center justify-center border-r border-neutral-200">
                {pages[leftPageIndex] ? (
                  <Image
                    src={pages[leftPageIndex]}
                    alt={`Page ${leftPageIndex + 1}`}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xs text-neutral-400">Trang trống</span>
                )}
                <div className="absolute inset-y-0 right-0 w-8 bg-linear-to-l from-black/15 to-transparent pointer-events-none" />
              </div>

              {isDoublePage && (
                <div className="relative w-[calc(100vw-5rem)] max-w-[320px] sm:w-100 md:w-112.5 aspect-3/4 bg-neutral-100 flex items-center justify-center">
                  {rightPageIndex !== null && pages[rightPageIndex] ? (
                    <Image
                      src={pages[rightPageIndex]}
                      alt={`Page ${rightPageIndex + 1}`}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-700 gap-2">
                      <span className="text-sm">Kết thúc</span>
                    </div>
                  )}
                  <div className="absolute inset-y-0 left-0 w-8 bg-linear-to-r from-black/15 to-transparent pointer-events-none" />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage + step >= totalPages}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 size-8 sm:size-10 rounded-full bg-gray-800 hover:bg-[#c29b57] disabled:opacity-30 disabled:hover:bg-white/10 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>
        </div>

        <div className="px-6 py-3 bg-[#0a1b35] border-t border-[#e2d5c3]/20 flex items-center justify-between text-xs text-white/60">
          <span className="truncate max-w-md">
            {article.publisher} • {article.date}
          </span>
          <span className="hidden sm:inline">
            Dùng phím mũi tên [←] [→] để lật trang, [Esc] để thoát
          </span>
        </div>
      </div>
    </div>
  );
}
