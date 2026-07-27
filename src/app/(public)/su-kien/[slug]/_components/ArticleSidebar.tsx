"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, User, Tag, Link2, Check } from "lucide-react";

interface ArticleSidebarProps {
  categoryVi: string | null;
  eventDate: string | null;
  eventTime: string | null;
  readTime: string | null;
  authorName: string | null;
  authorRole: string | null;
  authorAvatar: string | null;
  authorBio: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
}

export function ArticleSidebar({
  categoryVi,
  eventDate,
  eventTime,
  readTime,
  authorName,
  authorRole,
  authorAvatar,
  authorBio,
  ctaLabel,
  ctaHref,
}: ArticleSidebarProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setCurrentUrl(window.location.href);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl,
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl,
    )}`,
    zalo: `https://zalo.me/share?url=${encodeURIComponent(currentUrl)}`,
  };

  const row =
    "flex items-start gap-3 py-3 border-b border-gray-100 last:border-0";
  const iconWrap =
    "w-8 h-8 rounded-full bg-[#f3ecdd] text-[#8a6a3f] flex items-center justify-center shrink-0";

  return (
    <aside className="space-y-5">
      <div className="bg-white border border-[#efeae0] rounded-lg p-5">
        <h4
          className="text-base font-bold text-[#0a1b35] mb-1"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          THÔNG TIN BÀI VIẾT
        </h4>
        {categoryVi && (
          <div className={row}>
            <div className={iconWrap}>
              <Tag size={14} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Danh mục</p>
              <p className="text-sm text-[#0a1b35] font-medium">{categoryVi}</p>
            </div>
          </div>
        )}
        {eventDate && (
          <div className={row}>
            <div className={iconWrap}>
              <Calendar size={14} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Ngày đăng</p>
              <p className="text-sm text-[#0a1b35] font-medium">
                {eventDate} {eventTime ? `· ${eventTime}` : ""}
              </p>
            </div>
          </div>
        )}
        {readTime && (
          <div className={row}>
            <div className={iconWrap}>
              <Clock size={14} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Thời gian đọc</p>
              <p className="text-sm text-[#0a1b35] font-medium">{readTime}</p>
            </div>
          </div>
        )}
        {authorName && (
          <div className={row}>
            <div className={iconWrap}>
              <User size={14} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Tác giả</p>
              <p className="text-sm text-[#0a1b35] font-medium">{authorName}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-[#efeae0] rounded-lg p-5">
        <h4
          className="text-base font-bold text-[#0a1b35] mb-4"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          CHIA SẺ BÀI VIẾT
        </h4>
        <div className="flex items-center gap-3">
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-[#f3ecdd] text-[#0a1b35] flex items-center justify-center hover:bg-[#c29b57] hover:text-white transition-colors text-sm font-semibold"
          >
            f
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-[#f3ecdd] text-[#0a1b35] flex items-center justify-center hover:bg-[#c29b57] hover:text-white transition-colors text-sm font-semibold"
          >
            in
          </a>
          <a
            href={shareLinks.zalo}
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-[#f3ecdd] text-[#0a1b35] flex items-center justify-center hover:bg-[#c29b57] hover:text-white transition-colors text-xs font-semibold"
          >
            Zalo
          </a>
          <button
            onClick={handleCopy}
            className="w-10 h-10 rounded-full bg-[#f3ecdd] text-[#0a1b35] flex items-center justify-center hover:bg-[#c29b57] hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Link2 size={16} />}
          </button>
        </div>
      </div>

      {authorName && (
        <div className="bg-white border border-[#efeae0] rounded-lg p-5 text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden bg-[#f3ecdd] flex items-center justify-center text-[#8a6a3f] font-bold text-lg">
            {authorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-full h-full object-cover"
              />
            ) : (
              authorName.trim().slice(-1)
            )}
          </div>
          <p className="text-sm font-bold text-[#0a1b35]">{authorName}</p>
          {authorRole && (
            <p className="text-xs text-[#8a6a3f] mb-2">{authorRole}</p>
          )}
          {authorBio && (
            <p className="text-xs text-gray-500 leading-relaxed mt-2">
              {authorBio}
            </p>
          )}
          <a
            href={ctaHref || "#"}
            target="_blank"
            className="inline-block mt-4 text-[11px] font-semibold text-[#c29b57] border border-[#c29b57] rounded px-4 py-2 hover:bg-[#c29b57] hover:text-white transition-colors"
          >
            {(ctaLabel || "TÌM HIỂU THÊM").toUpperCase()}
          </a>
        </div>
      )}
    </aside>
  );
}
