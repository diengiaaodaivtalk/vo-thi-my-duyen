import { prisma } from "@/lib/prisma";
import { EventsCarousel } from "./EventsCarousel";

export async function Events() {
  const config = await prisma.eventsConfig.findFirst({
    include: {
      items: {
        where: { published: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!config || !config.items || config.items.length === 0) return null;

  const titleVi = config.titleVi || "";
  const titleEn = config.titleEn || "";

  const formattedEvents = config.items.map((item) => ({
    id: item.id,
    slug: item.slug,
    titleVi: item.titleVi || "",
    excerptVi: item.excerptVi || "",
    coverImg: item.coverImg || "",
    eventDate: item.eventDate || "",
    eventTime: item.eventTime || "",
  }));

  return (
    <section className="bg-[#fbfbfa] w-full py-16 overflow-hidden">
      <div className="mx-auto px-6 lg:px-16 relative">
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

        <EventsCarousel baseEvents={formattedEvents} />
      </div>
    </section>
  );
}
