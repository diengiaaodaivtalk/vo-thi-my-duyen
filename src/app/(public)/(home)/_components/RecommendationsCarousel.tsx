"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface RecommendationItem {
  name: string;
  roleLines: string[];
  timeAgo: string;
  quote: string;
  avatar: string;
}

export function RecommendationsCarousel({
  items,
}: {
  items: RecommendationItem[];
}) {
  const extendedItems = [...items, ...items, ...items];
  const [currentIndex, setCurrentIndex] = useState(items.length);
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
    if (currentIndex === items.length * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(items.length);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (currentIndex === items.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(items.length * 2 - 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, items.length]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <div className="relative w-full px-12 sm:px-12">
      <button
        onClick={handlePrev}
        className="absolute left-0 sm:-left-2 top-1/3 -translate-y-1/2 z-20 size-8 rounded-full border border-[#e2d5c3] bg-white text-[#0a1b35] hover:bg-[#c29b57] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
      >
        <ChevronLeft className="size-4" />
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
          className="flex gap-4 md:gap-6 [--items-per-screen:1] [--gap-offset:16px] sm:[--items-per-screen:2] md:[--gap-offset:24px] lg:[--items-per-screen:4]"
        >
          {extendedItems.map((item, index) => (
            <div
              key={index}
              className="shrink-0 w-full sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-72px)/4)] border border-[#efeae0] rounded-xl p-5 bg-white flex flex-col"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-4">
                <div className="sm:mt-2 border relative size-16 sm:size-12 rounded-full overflow-hidden shrink-0">
                  {item.avatar && (
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#c29b57] uppercase">
                    Recommendation
                  </span>
                  <h3 className="text-sm font-bold text-[#0a1b35] leading-snug">
                    {item.name}
                  </h3>
                  <div className="mb-3">
                    {item.roleLines.map((line, i) => (
                      <p key={i} className="text-xs text-gray-500 leading-snug">
                        {line}
                      </p>
                    ))}
                    <p className="text-[11px] text-gray-400 mt-1">
                      {item.timeAgo}
                    </p>
                  </div>
                </div>
              </div>

              <Quote className="size-4 text-[#c29b57] mb-2 fill-current" />

              <p className="text-xs text-gray-600 leading-relaxed">
                {item.quote}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-0 sm:-right-2 top-1/3 -translate-y-1/2 z-20 size-8 rounded-full border border-[#e2d5c3] bg-white text-[#0a1b35] hover:bg-[#c29b57] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
