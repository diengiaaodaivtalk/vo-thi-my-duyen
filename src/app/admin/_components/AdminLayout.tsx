"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  LogOut,
  User,
  PanelBottom,
  PanelTop,
  Undo2,
  LayoutDashboard,
  Form,
  CalendarDays,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface AdminLayoutProps {
  userEmail?: string;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  {
    label: "Quay lại Website",
    href: "/",
    icon: Undo2,
  },
  {
    label: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Quản trị Home",
    href: "/admin/home",
    icon: Home,
    subItems: [
      { label: "Hero Section", targetId: "hero-section" },
      { label: "Stats Section", targetId: "stats-section" },
      { label: "Hồ sơ nổi bật", targetId: "profile-section" },
      { label: "Mảng chuyên môn", targetId: "expertise-section" },
      { label: "Dịch vụ cung cấp", targetId: "services-section" },
      { label: "Recommendations", targetId: "recommendations-section" },
      { label: "Kết nối & Truyền thông", targetId: "media-section" },
      { label: "Bài viết đã xuất bản", targetId: "articles-section" },
      { label: "Đào tạo & Kết nối", targetId: "connect-training-section" },
      { label: "Hình ảnh hoạt động", targetId: "activity-section" },
      { label: "Chứng nhận", targetId: "certificates-section" },
      { label: "Đối tác & Khách hàng chiến lược", targetId: "clients-section" },
    ],
  },
  {
    label: "Quản trị Header",
    href: "/admin/header",
    icon: PanelTop,
  },
  {
    label: "Quản trị Footer",
    href: "/admin/footer",
    icon: PanelBottom,
  },
  {
    label: "Quản trị Form",
    href: "/admin/form-settings",
    icon: Form,
  },
  {
    label: "Quản trị Hoạt động & Sự kiện",
    href: "/admin/events",
    icon: CalendarDays,
  },
];

export function AdminLayout({
  userEmail,
  logoutAction,
  children,
}: AdminLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHomeExpanded, setIsHomeExpanded] = useState(true);
  const pathname = usePathname();

  const currentNav = NAV_ITEMS.find((item) => item.href === pathname);
  const pageTitle =
    currentNav && currentNav.href !== "/" ? currentNav.label : "Tổng quan";

  const handleScrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden relative">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 w-64 bg-[#0a1b35] text-white p-6 z-50 transition-transform duration-300 transform flex flex-col justify-between overflow-y-auto h-full
          lg:relative lg:transform-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wider text-[#c29b57]">
              Admin Panel
            </h1>
            <button
              className="lg:hidden text-white/70 hover:text-white p-1"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {NAV_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const hasSubItems = Boolean(
                item.subItems && item.subItems.length > 0,
              );

              return (
                <div key={index} className="space-y-1">
                  <div
                    className={`flex items-center justify-between px-4 py-2.5 rounded font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white hover:bg-white/5"
                    }`}
                  >
                    <a
                      href={item.href}
                      className="flex items-center gap-3 flex-1"
                    >
                      <Icon size={18} />
                      {item.label}
                    </a>

                    {isActive && hasSubItems && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsHomeExpanded(!isHomeExpanded);
                        }}
                        className="p-2 hover:bg-white/10 rounded transition-colors text-gray-300 hover:text-white cursor-pointer"
                      >
                        {isHomeExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                    )}
                  </div>

                  {isActive && hasSubItems && isHomeExpanded && (
                    <div className="pl-3 space-y-2 my-1">
                      {item.subItems?.map((subItem, subIndex) => (
                        <button
                          key={subIndex}
                          onClick={() =>
                            handleScrollToSection(subItem.targetId)
                          }
                          className="block w-full text-left py-1.5 px-3 text-xs text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors cursor-pointer"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 mt-6 shrink-0">
          <button
            onClick={() => logoutAction()}
            className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 rounded cursor-pointer transition-colors"
          >
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="flex justify-between items-center bg-white p-4 lg:px-8 border-b border-gray-200 shadow-sm sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 truncate">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 max-w-xs sm:max-w-none truncate">
            <User size={16} className="text-gray-400 shrink-0" />
            <span className="truncate hidden sm:inline">{userEmail}</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
