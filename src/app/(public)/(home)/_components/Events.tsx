import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export async function Events() {
  const config = await prisma.eventsConfig.findFirst({
    include: {
      items: {
        where: { published: true },
        orderBy: { order: "asc" },
        take: 4,
      },
    },
  });

  if (!config || !config.items || config.items.length === 0) return null;

  const titleVi = config.titleVi || "HOẠT ĐỘNG & SỰ KIỆN";
  const titleEn = config.titleEn || "ACTIVITIES & EVENTS";

  return (
    <section className="bg-[#fbfbfa] w-full py-16">
      <div className="mx-auto px-6 lg:px-16">
        <div className="text-center mb-12">
          <p
            className="text-sm italic text-[#c29b57] mb-1"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {titleEn}
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#0a1b35] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            {titleVi}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.items.map((item) => (
            <Link
              key={item.id}
              href={`/su-kien/${item.slug}`}
              className="group border border-[#efeae0] rounded hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white"
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
              <div className="p-4">
                <h3 className="text-sm font-bold text-[#0a1b35] leading-snug mb-2 line-clamp-2">
                  {item.titleVi}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                  {item.excerptVi}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#8a6a3f]">
                  <span>{item.eventDate}</span>
                  <span className="w-1 h-1 rounded-full bg-[#c29b57]" />
                  <span>{item.eventTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
