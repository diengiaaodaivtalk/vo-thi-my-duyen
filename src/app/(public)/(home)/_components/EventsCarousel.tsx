"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventItem {
  id: string;
  slug: string;
  titleVi: string;
  excerptVi: string | null;
  coverImg: string | null;
  eventDate: string | null;
  eventTime: string | null;
}

export function EventsCarousel({ baseEvents }: { baseEvents: EventItem[] }) {
  const extendedEvents = [...baseEvents, ...baseEvents, ...baseEvents];

  const [currentIndex, setCurrentIndex] = useState(baseEvents.length);
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
    if (currentIndex === baseEvents.length * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(baseEvents.length);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (currentIndex === baseEvents.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(baseEvents.length * 2 - 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, baseEvents.length]);

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
        className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full border border-[#e2d5c3] bg-white text-[#0a1b35] hover:bg-[#c29b57] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
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
          className="flex gap-4 md:gap-6 [--items-per-screen:1] [--gap-offset:16px] sm:[--items-per-screen:2] md:[--items-per-screen:3] md:[--gap-offset:24px] lg:[--items-per-screen:4] xl:[--items-per-screen:4]"
        >
          {extendedEvents.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="shrink-0 w-full sm:w-[calc((100%-16px)/2)] md:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)] xl:w-[calc((100%-72px)/4)] flex flex-col"
            >
              <Link
                href={`/su-kien/${item.slug}`}
                className="group border border-[#efeae0] rounded hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white h-full flex flex-col"
              >
                <div className="relative w-full aspect-3/2 overflow-hidden">
                  {item.coverImg && (
                    <Image
                      src={item.coverImg}
                      alt={item.titleVi}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <div className="p-4 flex flex-col grow">
                  <h3 className="text-sm font-bold text-[#0a1b35] leading-snug mb-2 line-clamp-2">
                    {item.titleVi}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2 grow">
                    {item.excerptVi}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#8a6a3f] mt-auto">
                    <span>{item.eventDate}</span>
                    <span className="w-1 h-1 rounded-full bg-[#c29b57]" />
                    <span>{item.eventTime}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 z-20 size-8 rounded-full border border-[#e2d5c3] bg-white text-[#0a1b35] hover:bg-[#c29b57] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
