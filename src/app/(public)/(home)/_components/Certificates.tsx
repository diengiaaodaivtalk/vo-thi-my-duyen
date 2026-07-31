import { prisma } from "@/lib/prisma";
import { CertificatesCarousel } from "./CertificatesCarousel";
import Link from "next/link";

export async function Certificates() {
  const certificatesConfig = await prisma.certificatesConfig.findFirst({
    include: {
      items: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (
    !certificatesConfig ||
    !certificatesConfig.items ||
    certificatesConfig.items.length === 0
  )
    return null;

  const titleVi = certificatesConfig.titleVi || "";
  const titleEn = certificatesConfig.titleEn || "";
  const descVi = certificatesConfig.descVi || "";
  const descEn = certificatesConfig.descEn || "";
  const buttonText = certificatesConfig.buttonText || "";
  const buttonHref = certificatesConfig.buttonHref || "#";

  const formattedItems = certificatesConfig.items.map((item) => ({
    id: item.id,
    img: item.img || "",
  }));

  return (
    <section className="w-full bg-[#fbfbfa] py-12 overflow-hidden">
      <div className="mx-auto px-6 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/4 shrink-0 text-center lg:text-left">
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#0a1b35] mt-2"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {titleVi}
            </h2>
            <p className="italic text-gray-500 text-base sm:text-lg mt-1">
              {titleEn}
            </p>

            <div className="mt-2 flex items-center justify-center lg:justify-start">
              <span className="w-full max-w-25 lg:max-w-none h-0.5 bg-[#c29b57]"></span>
              <span className="text-[#c29b57] text-2xl leading-none mx-1">
                ✦
              </span>
              <span className="w-full max-w-25 lg:max-w-none h-0.5 bg-[#c29b57]"></span>
            </div>

            {(descVi || descEn) && (
              <div className="mt-3 space-y-1">
                {descVi && (
                  <p className="text-sm font-semibold text-gray-600 leading-relaxed">
                    {descVi}
                  </p>
                )}
                {descEn && (
                  <p className="text-sm italic text-gray-400 leading-relaxed">
                    {descEn}
                  </p>
                )}
              </div>
            )}

            {buttonText && (
              <Link
                href={buttonHref}
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full border border-[#c29b57] text-[#c29b57] text-sm font-semibold hover:bg-[#c29b57] hover:text-white transition-colors"
              >
                {buttonText}
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>

          <div className="w-full lg:w-3/4 min-w-0 relative">
            <CertificatesCarousel baseItems={formattedItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
