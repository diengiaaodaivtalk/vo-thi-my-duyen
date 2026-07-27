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

const recommendations: RecommendationItem[] = [
  {
    name: "Nguyễn Thanh Lâm",
    roleLines: ["Tổng Giám đốc", "Tập đoàn TTC"],
    timeAgo: "2 tháng trước",
    quote:
      "Duyên là một chuyên gia chiến lược sắc bén, luôn nhìn vấn đề ở tầm tổng thể nhưng vẫn đi sâu vào những yếu tố cốt lõi. Những chương trình và tư vấn của Duyên đã giúp đội ngũ lãnh đạo của chúng tôi nâng tầm tư duy và tạo ra những bước chuyển đổi mang tính đột phá.",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Lê Hồng Minh",
    roleLines: ["Chủ tịch HĐQT", "VNG Corporation"],
    timeAgo: "1 tháng trước",
    quote:
      "Duyên kết hợp rất tốt giữa tư duy chiến lược, năng lực công nghệ và khả năng truyền cảm hứng. Các chương trình về AI và lãnh đạo của Duyên luôn thực tiễn, cập nhật và đặc biệt hiệu quả, giúp tổ chức của chúng tôi ứng dụng nhanh chóng vào thực tế.",
    avatar:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "PGS.TS. Trần Thị Minh Hòa",
    roleLines: ["Hiệu trưởng", "Trường Đại học Kinh tế TP.HCM"],
    timeAgo: "Tháng 4/2024",
    quote:
      "Duyên là đối tác chiến lược tin cậy trong hành trình nâng cao năng lực lãnh đạo và phát triển nguồn nhân lực. Không chỉ giỏi chuyên môn, Duyên còn rất tâm huyết, chuyên nghiệp và luôn đặt giá trị bền vững cho cộng đồng giáo dục.",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "David Tan",
    roleLines: ["Regional Director", "Alex Global Consulting"],
    timeAgo: "Tháng 3/2024",
    quote:
      "Working with Duyen has been an exceptional experience. Her global mindset, cross-cultural capability and strategic insight consistently deliver measurable impact for organizations across industries and countries.",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
  },
];

export function Recommendations() {
  const extendedItems = [
    ...recommendations,
    ...recommendations,
    ...recommendations,
  ];
  const [currentIndex, setCurrentIndex] = useState(recommendations.length);
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
    if (currentIndex === recommendations.length * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(recommendations.length);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (currentIndex === recommendations.length - 1) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(recommendations.length * 2 - 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return (
    <section className="w-full bg-[#fbfbfa] py-16 lg:py-20">
      <div className="mx-auto px-6 lg:px-16 max-w-7xl">
        <div className="border border-[#e2d5c3] rounded-2xl px-6 py-10 lg:px-12 lg:py-12">
          <div className="text-center mb-10">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#0a1b35] tracking-widest uppercase mb-3"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Recommendations
            </h2>
            <p
              className="text-lg font-semibold text-[#0a1b35] mb-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Chia sẻ từ Lãnh đạo, Đối tác & Cấp quản lý
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Không chỉ là cảm nhận từ học viên hay khách hàng, đây là những lời
              đánh giá từ các lãnh đạo, đối tác và quản lý từng đồng hành cùng
              Võ Thị Mỹ Duyên.
            </p>
          </div>

          <div className="relative px-8 sm:px-10">
            <button
              onClick={handlePrev}
              className="absolute left-0 sm:-left-3 top-1/3 -translate-y-1/2 z-20 size-8 rounded-full border border-[#e2d5c3] bg-white text-[#0a1b35] hover:bg-[#c29b57] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
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
                className="flex gap-5 md:gap-6 [--items-per-screen:1] [--gap-offset:20px] sm:[--items-per-screen:2] lg:[--items-per-screen:4]"
              >
                {extendedItems.map((item, index) => (
                  <div
                    key={index}
                    className="shrink-0 w-full sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-60px)/4)] border border-[#efeae0] rounded-xl p-5 bg-white flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative size-12 rounded-full overflow-hidden shrink-0">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold text-[#c29b57] uppercase tracking-wide">
                          Recommendation
                        </span>
                        <h3 className="text-sm font-bold text-[#0a1b35] leading-snug">
                          {item.name}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-3">
                      {item.roleLines.map((line, i) => (
                        <p
                          key={i}
                          className="text-xs text-gray-500 leading-snug"
                        >
                          {line}
                        </p>
                      ))}
                      <p className="text-[11px] text-gray-400 mt-1">
                        {item.timeAgo}
                      </p>
                    </div>

                    <Quote className="size-4 text-[#c29b57] mb-2" />

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.quote}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 sm:-right-3 top-1/3 -translate-y-1/2 z-20 size-8 rounded-full border border-[#e2d5c3] bg-white text-[#0a1b35] hover:bg-[#c29b57] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
