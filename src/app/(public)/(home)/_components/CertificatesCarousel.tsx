"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CertificateCarouselItem {
  id?: string;
  img: string;
}

export function CertificatesCarousel({
  baseItems,
}: {
  baseItems: CertificateCarouselItem[];
}) {
  const extendedItems = [...baseItems, ...baseItems, ...baseItems];

  const [currentIndex, setCurrentIndex] = useState(baseItems.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    if (!isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentIndex === baseItems.length * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(baseItems.length);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (currentIndex === baseItems.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(baseItems.length * 2 - 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, baseItems.length]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const realIndex =
    (((currentIndex - baseItems.length) % baseItems.length) +
      baseItems.length) %
    baseItems.length;

  const goToReal = (targetReal: number) => {
    if (!isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(baseItems.length + targetReal);
  };

  const renderPaginationDots = () => {
    const total = baseItems.length;
    const maxVisible = 7;

    if (total <= maxVisible) {
      return baseItems.map((_, i) => (
        <button
          key={i}
          aria-label={`Đến chứng nhận ${i + 1}`}
          onClick={() => goToReal(i)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            i === realIndex
              ? "w-6 bg-[#c29b57]"
              : "w-1.5 bg-[#e2d5c3] hover:bg-[#c29b57]/60"
          }`}
        />
      ));
    }

    const items = [];
    const showLeftEllipsis = realIndex > 3;
    const showRightEllipsis = realIndex < total - 4;

    items.push(0);

    if (showLeftEllipsis) {
      items.push("left-ellipsis");
      const start = Math.max(1, realIndex - 1);
      const end = Math.min(total - 2, realIndex + 1);
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
    } else {
      for (let i = 1; i <= 4; i++) {
        items.push(i);
      }
    }

    if (showRightEllipsis) {
      items.push("right-ellipsis");
    } else {
      for (let i = total - 5; i < total - 1; i++) {
        if (!items.includes(i)) {
          items.push(i);
        }
      }
    }

    if (!items.includes(total - 1)) {
      items.push(total - 1);
    }

    return items.map((item, idx) => {
      if (typeof item === "string") {
        return (
          <span
            key={`${item}-${idx}`}
            className="text-[#c29b57] text-xs font-bold leading-none select-none px-0.5"
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={item}
          aria-label={`Đến chứng nhận ${item + 1}`}
          onClick={() => goToReal(item)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            item === realIndex
              ? "w-6 bg-[#c29b57]"
              : "w-1.5 bg-[#e2d5c3] hover:bg-[#c29b57]/60"
          }`}
        />
      );
    });
  };

  return (
    <div className="relative w-full px-10 sm:px-12">
      <button
        onClick={handlePrev}
        aria-label="Trước"
        className="absolute left-0 top-2/5 -translate-y-1/2 z-20 size-8 sm:size-9 rounded-full border border-[#e2d5c3] bg-white text-[#0a1b35] hover:bg-[#c29b57] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
      >
        <ChevronLeft className="size-4 sm:size-5" />
      </button>

      <div className="w-full overflow-hidden" ref={trackRef}>
        <div
          style={
            {
              transform: `translateX(calc(-${currentIndex} * (100% + var(--gap-offset)) / var(--items-per-screen)))`,
              transition: isTransitioning
                ? "transform 300ms ease-in-out"
                : "none",
            } as CSSProperties
          }
          className="flex gap-4 [--items-per-screen:1] [--gap-offset:16px] sm:[--items-per-screen:2] lg:[--items-per-screen:4] 2xl:[--items-per-screen:5]"
        >
          {extendedItems.map((item, index) => (
            <div
              key={index}
              className="shrink-0 w-full sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-48px)/4)] 2xl:w-[calc((100%-64px)/5)]"
            >
              <div className="relative w-full aspect-3/4 rounded-md overflow-hidden shadow-sm border border-gray-100 bg-white">
                {item.img && (
                  <Image
                    src={item.img}
                    alt="Certificate"
                    fill
                    className="object-contain p-2"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        aria-label="Tiếp"
        className="absolute right-0 top-2/5 -translate-y-1/2 z-20 size-8 sm:size-9 rounded-full border border-[#e2d5c3] bg-white text-[#0a1b35] hover:bg-[#c29b57] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
      >
        <ChevronRight className="size-4 sm:size-5" />
      </button>

      {baseItems.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {renderPaginationDots()}
        </div>
      )}
    </div>
  );
}
