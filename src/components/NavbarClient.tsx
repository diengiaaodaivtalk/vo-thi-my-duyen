"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

interface NavItem {
  labelVi: string;
  labelEn: string;
  href: string;
}

interface NavbarClientProps {
  logo: string;
  nameVi: string;
  nameEn: string;
  subtitle1Vi: string;
  subtitle1En: string;
  bookTextVi: string;
  bookTextEn: string;
  bookHref: string;
  navItems: NavItem[];
}

export function NavbarClient({
  logo,
  nameVi,
  nameEn,
  subtitle1Vi,
  subtitle1En,
  bookTextVi,
  bookTextEn,
  bookHref,
  navItems,
}: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"VI" | "EN">("VI");

  return (
    <nav
      id="navbar"
      className="w-full bg-[#fbfbfa] sticky top-0 z-50 border-b border-[#e2d5c3]"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 gap-2 xl:gap-4">
          <Link
            href={"/"}
            className="flex items-center gap-2 sm:gap-3 shrink-0 max-w-[80%] xl:max-w-[320px]"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#c29b57] shrink-0">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={100}
                className="object-contain size-full"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span
                className="text-base lg:text-lg font-bold text-[#0a1b35] leading-tight"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                {language === "VI" ? nameVi : nameEn}
              </span>
              <span className="text-[10px] text-[#0a1b35] font-bold uppercase mt-0.5 leading-tight wrap-break-word">
                {subtitle1Vi}
              </span>
              <span className="text-[9px] text-[#0a1b35] uppercase font-medium mt-0.5 leading-tight wrap-break-word">
                {subtitle1En}
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center justify-center space-x-2 xl:space-x-4 shrink min-w-0">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group flex flex-col items-center text-center px-1 max-w-17.5 xl:max-w-22.5 shrink min-w-0"
              >
                <span className="text-[10px] xl:text-[11px] font-bold text-[#0a1b35] group-hover:text-[#c29b57] transition-colors duration-200 leading-tight wrap-break-word text-center w-full">
                  {item.labelVi}
                </span>
                <span className="text-[9px] xl:text-[10px] italic text-[#0a1b35] group-hover:text-[#c29b57] transition-colors duration-200 leading-tight wrap-break-word text-center w-full">
                  {item.labelEn}
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 shrink-0">
            <div className="flex bg-white rounded-full overflow-hidden border border-[#c29b57]">
              <button
                onClick={() => setLanguage("VI")}
                className={`px-2.5 xl:px-3 py-1 text-xs font-bold cursor-pointer ${
                  language === "VI"
                    ? "bg-[#c29b57] text-white"
                    : "text-gray-500"
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLanguage("EN")}
                className={`px-2.5 xl:px-3 py-1 text-xs font-bold cursor-pointer ${
                  language === "EN"
                    ? "bg-[#c29b57] text-white"
                    : "text-gray-500"
                }`}
              >
                EN
              </button>
            </div>
            <Link
              href={bookHref}
              className="hidden lg:flex flex-col items-center justify-center text-center bg-linear-to-b from-[#d5b06d] to-[#b3874c] hover:opacity-95 text-white px-3 xl:px-5 py-2 rounded shadow-sm transition-all active:scale-95 shrink-0"
            >
              <span className="text-[10px] xl:text-[11px] font-bold whitespace-nowrap">
                {bookTextVi}
              </span>
              <span className="text-[8px] xl:text-[9px] uppercase opacity-90 whitespace-nowrap">
                {bookTextEn}
              </span>
            </Link>
          </div>

          <div className="flex items-center lg:hidden shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#0a1b35] hover:text-[#c29b57] focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-[#fbfbfa] border-t border-[#e2d5c3] absolute w-full left-0 right-0 shadow-xl z-50 max-h-[calc(100vh-82px)] overflow-y-auto">
          <div className="px-6 pt-3 pb-6 space-y-2 flex flex-col items-start">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="w-full py-2.5 border-b border-gray-100 last:border-none flex flex-col items-start justify-center"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-sm font-bold text-[#0a1b35]">
                  {item.labelVi}
                </span>
                <span className="text-xs text-[#0a1b35] italic">
                  {item.labelEn}
                </span>
              </Link>
            ))}
            <div className="pt-4 w-full flex flex-col items-start gap-4">
              <div className="flex bg-white rounded-full overflow-hidden border border-[#c29b57]">
                <button
                  onClick={() => setLanguage("VI")}
                  className={`px-4 py-1.5 text-xs font-bold ${
                    language === "VI"
                      ? "bg-[#c29b57] text-white"
                      : "text-gray-500"
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => setLanguage("EN")}
                  className={`px-4 py-1.5 text-xs font-bold ${
                    language === "EN"
                      ? "bg-[#c29b57] text-white"
                      : "text-gray-500"
                  }`}
                >
                  EN
                </button>
              </div>
              <Link
                href={bookHref}
                className="w-full flex flex-col items-center justify-center bg-linear-to-b from-[#d5b06d] to-[#b3874c] text-white py-2 rounded-md shadow-sm active:scale-95"
              >
                <span className="text-xs font-bold">{bookTextVi}</span>
                <span className="text-[10px] uppercase">{bookTextEn}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
