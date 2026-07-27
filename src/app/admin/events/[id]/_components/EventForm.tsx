"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload, ExternalLink } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { AvatarCropper } from "../../../_components/AvatarCropper";
import { updateEventAction } from "../../actions";
import type { EventItemParam } from "../../types";

export function EventForm({ initialData }: { initialData: EventItemParam }) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(initialData.coverImg || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    initialData.authorAvatar || "",
  );
  const [cropSource, setCropSource] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const set = <K extends keyof EventItemParam>(
    key: K,
    value: EventItemParam[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleCoverChange = (file: File | undefined) => {
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleAvatarChange = (file: File | undefined) => {
    if (!file) return;
    setCropSource(file);
  };

  const handleCropConfirm = (blob: Blob) => {
    const croppedFile = new File([blob], "avatar.png", { type: "image/png" });
    setAvatarFile(croppedFile);
    setAvatarPreview(URL.createObjectURL(croppedFile));
    setCropSource(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateEventAction(
      {
        id: form.id as string,
        categoryVi: form.categoryVi || "",
        categoryEn: form.categoryEn || "",
        titleVi: form.titleVi,
        titleEn: form.titleEn || "",
        excerptVi: form.excerptVi || "",
        excerptEn: form.excerptEn || "",
        eventDate: form.eventDate || "",
        eventTime: form.eventTime || "",
        authorName: form.authorName || "",
        authorRole: form.authorRole || "",
        authorBio: form.authorBio || "",
        readTime: form.readTime || "",
        published: !!form.published,
        contentHtmlVi: form.contentHtmlVi || "",
        contentHtmlEn: form.contentHtmlEn || "",
        metaTitle: form.metaTitle || "",
        metaDescription: form.metaDescription || "",
        ctaLabel: form.ctaLabel || "",
        ctaHref: form.ctaHref || "",
      },
      coverFile,
      avatarFile,
    );
    setForm((prev) => ({ ...prev, slug: result.slug }));
    setSaving(false);
    setSavedMsg("Đã lưu thay đổi");
    setTimeout(() => setSavedMsg(""), 2000);
    router.refresh();
  };

  const inputClass =
    "text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]";
  const label = "text-xs font-semibold text-gray-700 block mb-1";

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-800">
            Chỉnh sửa bài viết
          </h3>
          {form.slug && !form.slug.startsWith("bai-viet-moi-") && (
            <a
              href={`/su-kien/${form.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#c29b57] flex items-center gap-1 hover:underline"
            >
              Xem trang <ExternalLink size={12} />
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="text-xs text-green-600">{savedMsg}</span>
          )}
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            Công khai
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#0a1b35] text-white rounded-lg text-sm font-semibold hover:bg-[#0a1b35]/90 disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            {saving ? "Đang lưu..." : "Lưu bài viết"}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className={label}>Tiêu đề (Tiếng Việt)</span>
            <input
              className={inputClass}
              value={form.titleVi}
              onChange={(e) => set("titleVi", e.target.value)}
            />
          </div>
          <div>
            <span className={label}>Tiêu đề (Tiếng Anh)</span>
            <input
              className={inputClass}
              value={form.titleEn || ""}
              onChange={(e) => set("titleEn", e.target.value)}
            />
          </div>
        </div>

        <div>
          <span className={label}>Mô tả ngắn (Tiếng Việt)</span>
          <textarea
            rows={2}
            className={inputClass}
            value={form.excerptVi || ""}
            onChange={(e) => set("excerptVi", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <span className={label}>Danh mục</span>
            <input
              className={inputClass}
              value={form.categoryVi || ""}
              onChange={(e) => set("categoryVi", e.target.value)}
            />
          </div>
          <div>
            <span className={label}>Ngày (vd 15/05/2024)</span>
            <input
              className={inputClass}
              value={form.eventDate || ""}
              onChange={(e) => set("eventDate", e.target.value)}
            />
          </div>
          <div>
            <span className={label}>Giờ (vd 09:00 AM)</span>
            <input
              className={inputClass}
              value={form.eventTime || ""}
              onChange={(e) => set("eventTime", e.target.value)}
            />
          </div>
          <div>
            <span className={label}>Thời gian đọc</span>
            <input
              className={inputClass}
              value={form.readTime || ""}
              onChange={(e) => set("readTime", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className={label}>Tên tác giả</span>
            <input
              className={inputClass}
              value={form.authorName || ""}
              onChange={(e) => set("authorName", e.target.value)}
            />
          </div>
          <div>
            <span className={label}>Chức danh</span>
            <input
              className={inputClass}
              value={form.authorRole || ""}
              onChange={(e) => set("authorRole", e.target.value)}
            />
          </div>
        </div>

        <div>
          <span className={label}>
            Bio tác giả (hiển thị ở khung bên phải bài viết)
          </span>
          <textarea
            rows={2}
            className={inputClass}
            value={form.authorBio || ""}
            onChange={(e) => set("authorBio", e.target.value)}
          />
        </div>

        <div>
          <span className={label}>
            Ảnh đại diện tác giả (tỉ lệ 1:1, khuyến nghị 300 x 300px, dưới 1MB)
          </span>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[9px] text-gray-400">Trống</span>
              )}
            </div>
            <label className="px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs rounded-lg cursor-pointer hover:bg-gray-50 font-medium flex items-center gap-1">
              <Upload size={12} /> Tải ảnh đại diện
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleAvatarChange(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>

        <div>
          <span className={label}>
            Ảnh bìa (tỉ lệ 3:2, khuyến nghị 1200 x 800px, dưới 2MB — hiển thị ở
            thẻ trang chủ và đầu bài viết)
          </span>
          <div className="flex items-center gap-4">
            <div className="w-40 aspect-3/2 border border-gray-300 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center">
              {coverPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverPreview}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[10px] text-gray-400">Trống</span>
              )}
            </div>
            <label className="px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs rounded-lg cursor-pointer hover:bg-gray-50 font-medium flex items-center gap-1">
              <Upload size={12} /> Tải ảnh bìa
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleCoverChange(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-3">
          Cấu hình SEO / Metadata
        </h4>
        <div>
          <span className={label}>
            Meta title (để trống sẽ dùng tiêu đề bài viết)
          </span>
          <input
            className={inputClass}
            value={form.metaTitle || ""}
            onChange={(e) => set("metaTitle", e.target.value)}
          />
        </div>
        <div>
          <span className={label}>
            Meta description (để trống sẽ dùng mô tả ngắn)
          </span>
          <textarea
            rows={2}
            className={inputClass}
            value={form.metaDescription || ""}
            onChange={(e) => set("metaDescription", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className={label}>Nhãn nút CTA tác giả</span>
            <input
              className={inputClass}
              value={form.ctaLabel || ""}
              onChange={(e) => set("ctaLabel", e.target.value)}
              placeholder="TÌM HIỂU THÊM"
            />
          </div>
          <div>
            <span className={label}>Đường dẫn nút CTA tác giả</span>
            <input
              className={inputClass}
              value={form.ctaHref || ""}
              onChange={(e) => set("ctaHref", e.target.value)}
              placeholder="/ve-toi"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <span className={label}>Nội dung bài viết (Tiếng Việt)</span>
        <RichTextEditor
          value={form.contentHtmlVi || ""}
          onChange={(html) => set("contentHtmlVi", html)}
        />
      </div>

      {cropSource && (
        <AvatarCropper
          file={cropSource}
          onCancel={() => setCropSource(null)}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}
