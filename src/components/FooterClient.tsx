// FooterClient.tsx
"use client";

import { useState } from "react";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { submitFormAction } from "@/app/actions/form-submit";
import Link from "next/link";

interface FooterDataProps {
  data: {
    contactTitleVi: string;
    contactTitleEn: string;
    phone: string;
    email: string;
    website: string;
    addressVi: string;
    addressEn: string;
    bookTitleVi: string;
    bookTitleEn: string;
    newsletterTitleVi: string;
    newsletterTitleEn: string;
    newsletterDescVi: string;
    newsletterDescEn: string;
    copyrightText: string;
    sloganText: string;
  };
}

export function FooterClient({ data }: FooterDataProps) {
  const [speakerForm, setSpeakerForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    request: "",
    expectedDate: "",
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [speakerStatus, setSpeakerStatus] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [speakerSubmitting, setSpeakerSubmitting] = useState(false);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  const handleSpeakerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpeakerSubmitting(true);
    setSpeakerStatus("");

    const result = await submitFormAction({
      formKey: "speaker-booking",
      subject: "vothimyduyen.com - Yêu cầu đặt lịch diễn giả mới",
      fields: {
        "Họ và tên": speakerForm.fullName,
        Email: speakerForm.email,
        "Số điện thoại": speakerForm.phone,
        "Tổ chức": speakerForm.organization,
        "Nội dung yêu cầu": speakerForm.request,
        "Thời gian dự kiến": speakerForm.expectedDate,
      },
    });

    setSpeakerSubmitting(false);
    setSpeakerStatus(result.message);

    if (result.success) {
      setSpeakerForm({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        request: "",
        expectedDate: "",
      });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterSubmitting(true);
    setNewsletterStatus("");

    const result = await submitFormAction({
      formKey: "newsletter",
      subject: "Đăng ký newsletter mới",
      fields: { Email: newsletterEmail },
    });

    setNewsletterSubmitting(false);
    setNewsletterStatus(result.message);

    if (result.success) {
      setNewsletterEmail("");
    }
  };

  return (
    <footer
      id="footer"
      className="w-full bg-[#0a1b35] text-white relative overflow-hidden pt-12 pb-6 border-t border-[#c29b57]/20"
    >
      <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-10 pointer-events-none select-none hidden lg:block">
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <path
            d="M0,300 C150,200 250,350 400,250 L400,400 L0,400 Z"
            fill="url(#goldGradient)"
          />
          <path
            d="M0,250 C100,150 300,300 400,180"
            stroke="#c29b57"
            strokeWidth="1"
          />
          <path
            d="M0,280 C120,180 280,320 400,210"
            stroke="#c29b57"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient
              id="goldGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#c29b57" stopOpacity="0" />
              <stop offset="100%" stopColor="#c29b57" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-start pb-12 border-b border-white/10">
          <div className="lg:col-span-3 flex flex-col h-full lg:border-r lg:border-white/10 lg:pr-6">
            <h3 className="text-lg lg:text-base font-bold mb-6 flex flex-wrap items-center gap-1.5">
              <span className="text-[#c29b57]">{data.contactTitleVi}</span>
              <span className="text-white/60 text-xs font-normal italic">
                / {data.contactTitleEn}
              </span>
            </h3>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#c29b57] group-hover:bg-[#c29b57] group-hover:text-[#0a1b35] transition-colors">
                  <Phone className="size-5" />
                </div>
                <span className="text-white/80 font-medium">{data.phone}</span>
              </div>

              <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#c29b57] group-hover:bg-[#c29b57] group-hover:text-[#0a1b35] transition-colors">
                  <Mail className="size-5" />
                </div>
                <Link
                  href={`mailto:${data.email}`}
                  className="text-white/80 hover:text-[#c29b57] transition-colors"
                >
                  {data.email}
                </Link>
              </div>

              <div className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#c29b57] group-hover:bg-[#c29b57] group-hover:text-[#0a1b35] transition-colors">
                  <Globe className="size-5" />
                </div>
                <Link
                  href={
                    data.website.startsWith("http")
                      ? data.website
                      : `https://${data.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#c29b57] transition-colors"
                >
                  {data.website}
                </Link>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#c29b57] mt-0.5 shrink-0 group-hover:bg-[#c29b57] group-hover:text-[#0a1b35] transition-colors">
                  <MapPin className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white/80 font-medium">
                    {data.addressVi}
                  </span>
                  <span className="text-white/60 text-xs italic">
                    {data.addressEn}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <h3 className="text-lg lg:text-base font-bold mb-6 flex flex-wrap items-center gap-1.5">
              <span className="text-[#c29b57]">{data.bookTitleVi}</span>
              <span className="text-white/60 text-xs font-normal italic">
                / {data.bookTitleEn}
              </span>
            </h3>

            <form
              onSubmit={handleSpeakerSubmit}
              className="bg-white rounded-lg p-1 shadow-inner overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200">
                <input
                  type="text"
                  placeholder="Họ và tên / Full name"
                  className="bg-white px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                  value={speakerForm.fullName}
                  onChange={(e) =>
                    setSpeakerForm({ ...speakerForm, fullName: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-white px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                  value={speakerForm.email}
                  onChange={(e) =>
                    setSpeakerForm({ ...speakerForm, email: e.target.value })
                  }
                  required
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại / Phone number"
                  className="bg-white px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                  value={speakerForm.phone}
                  onChange={(e) =>
                    setSpeakerForm({ ...speakerForm, phone: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Tên tổ chức / Organization"
                  className="bg-white px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                  value={speakerForm.organization}
                  onChange={(e) =>
                    setSpeakerForm({
                      ...speakerForm,
                      organization: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Nội dung yêu cầu / Your request"
                  className="bg-white px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                  value={speakerForm.request}
                  onChange={(e) =>
                    setSpeakerForm({ ...speakerForm, request: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Thời gian dự kiến / Expected date"
                  className="bg-white px-4 py-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
                  value={speakerForm.expectedDate}
                  onChange={(e) =>
                    setSpeakerForm({
                      ...speakerForm,
                      expectedDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="bg-white p-2 flex flex-col items-center gap-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={speakerSubmitting}
                  className="relative z-10 bg-linear-to-r from-[#c29b57] to-[#a37c3f] text-white text-[11px] font-bold uppercase py-2.5 px-8 rounded-full shadow transition-all duration-300 cursor-pointer overflow-hidden disabled:opacity-50 before:absolute before:inset-0 before:bg-linear-to-b before:from-[#a37c3f] before:to-[#c29b57] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:-z-10"
                >
                  {speakerSubmitting
                    ? "ĐANG GỬI..."
                    : "GỬI YÊU CẦU / SEND REQUEST"}
                </button>
                {speakerStatus && (
                  <div className="mt-1 w-fit mx-auto rounded-full px-3 py-1">
                    <p className="text-[15px] text-center font-semibold text-black">
                      {speakerStatus}
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-4 flex flex-col lg:pl-4">
            <h3 className="text-lg lg:text-base font-bold mb-4 flex flex-wrap items-center gap-1.5">
              <span className="text-[#c29b57]">{data.newsletterTitleVi}</span>
              <span className="text-white/60 text-xs font-normal italic">
                / {data.newsletterTitleEn}
              </span>
            </h3>

            <p className="text-xs text-white/70 leading-relaxed mb-6">
              {data.newsletterDescVi}
              <span className="block italic text-white/60 mt-1">
                {data.newsletterDescEn}
              </span>
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Nhập email của bạn / Your email"
                className="w-full bg-white text-gray-800 rounded-lg px-4 py-3 text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#c29b57]"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="relative z-10 w-full bg-linear-to-br from-[#c29b57] to-[#a37c3f] text-white text-xs font-bold uppercase py-3 rounded-lg shadow transition-all duration-300 cursor-pointer overflow-hidden disabled:opacity-50 before:absolute before:inset-0 before:bg-linear-to-br before:from-[#a37c3f] before:to-[#c29b57] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 before:-z-10"
              >
                {newsletterSubmitting ? "ĐANG GỬI..." : "ĐĂNG KÝ / SUBSCRIBE"}
              </button>
              {newsletterStatus && (
                <div className="mt-1 w-fit mx-auto rounded-md bg-white/5 border border-white/10 px-3 py-1">
                  <p className="text-sm text-center font-[550] text-[#c29b57]">
                    {newsletterStatus}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>{data.copyrightText}</div>

          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6 text-[#c29b57] opacity-80"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 21C12 21 7 17 7 13C7 10 9 8 12 5C15 8 17 10 17 13C17 17 12 21 12 21Z" />
              <path d="M12 21C12 21 4 18 4 13C4 9.5 7 8 10 6" />
              <path d="M12 21C12 21 20 18 20 13C20 9.5 17 8 14 6" />
              <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" />
            </svg>
            <span className="italic font-light text-white/70 text-center md:text-left text-[11px] sm:text-xs">
              {data.sloganText}
            </span>
          </div>

          <div className="hidden lg:block w-24"></div>
        </div>
      </div>
    </footer>
  );
}
