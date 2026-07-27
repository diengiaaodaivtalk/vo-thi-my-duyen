import { prisma } from "@/lib/prisma";
import { RecommendationsCarousel } from "./RecommendationsCarousel";

export async function Recommendations() {
  const config = await prisma.recommendationsConfig.findFirst({
    include: {
      items: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!config || !config.items || config.items.length === 0) return null;

  const formattedItems = config.items.map((item) => ({
    name: item.name || "",
    roleLines: [item.roleLine1, item.roleLine2].filter(Boolean) as string[],
    timeAgo: item.timeAgo || "",
    quote: item.quote || "",
    avatar: item.avatar || "",
  }));

  return (
    <section className="w-full bg-[#fbfbfa] py-16 lg:py-20">
      <div className="mx-auto px-6 lg:px-16 max-w-7xl">
        <div className="border border-[#e2d5c3] rounded-2xl px-6 py-10 lg:px-12 lg:py-12">
          <div className="text-center mb-10">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#0a1b35] tracking-widest uppercase mb-3"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {config.titleVi}
            </h2>
            <p
              className="text-lg font-semibold text-[#0a1b35] mb-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {config.subtitle}
            </p>
            {config.descVi && (
              <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                {config.descVi}
              </p>
            )}
          </div>

          <RecommendationsCarousel items={formattedItems} />
        </div>
      </div>
    </section>
  );
}
