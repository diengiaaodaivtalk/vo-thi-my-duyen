"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Upload,
  ChevronLeft,
  ChevronRight,
  RotateCw,
} from "lucide-react";

interface CertificateItem {
  id?: string;
  img: string;
  originalImg?: string;
  imageFile?: File | null;
}

interface CertificatesConfigData {
  id?: string;
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  buttonText: string;
  buttonHref: string;
  items: CertificateItem[];
}

interface CertificatesFormProps {
  initialData: CertificatesConfigData | null;
  onSave: (
    formData: FormData,
    items: CertificateItem[],
  ) => Promise<CertificatesConfigData | null | void>;
}

async function rotateImageSource(
  src: string,
  fileName: string,
): Promise<{ url: string; file: File }> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalHeight;
  canvas.height = img.naturalWidth;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Không thể tạo canvas");

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(Math.PI / 2);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error("Không thể xử lý ảnh"));
    }, "image/png");
  });

  const rotatedFile = new File([blob], fileName, { type: "image/png" });
  const url = URL.createObjectURL(blob);
  return { url, file: rotatedFile };
}

function toFormItems(items: CertificateItem[]): CertificateItem[] {
  return items.map((item) => ({
    id: item.id,
    img: item.img,
    originalImg: item.originalImg ?? item.img,
    imageFile: null,
  }));
}

export function CertificatesForm({
  initialData,
  onSave,
}: CertificatesFormProps) {
  const [titleVi, setTitleVi] = useState(initialData?.titleVi || "CHỨNG NHẬN");
  const [titleEn, setTitleEn] = useState(
    initialData?.titleEn || "CERTIFICATES & AWARDS",
  );
  const [descVi, setDescVi] = useState(initialData?.descVi || "");
  const [descEn, setDescEn] = useState(initialData?.descEn || "");
  const [buttonText, setButtonText] = useState(
    initialData?.buttonText || "Xem tất cả chứng nhận",
  );
  const [buttonHref, setButtonHref] = useState(initialData?.buttonHref || "");
  const [items, setItems] = useState<CertificateItem[]>(
    toFormItems(initialData?.items || []),
  );
  const [loading, setLoading] = useState(false);
  const [rotatingIndex, setRotatingIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await onSave(formData, items);
    if (result) {
      setTitleVi(result.titleVi);
      setTitleEn(result.titleEn);
      setDescVi(result.descVi);
      setDescEn(result.descEn);
      setButtonText(result.buttonText);
      setButtonHref(result.buttonHref);
      setItems(toFormItems(result.items));
    } else {
      setItems((prev) => prev.map((item) => ({ ...item, imageFile: null })));
    }
    setLoading(false);
  };

  const handleAddItem = () =>
    setItems([...items, { img: "", originalImg: "", imageFile: null }]);

  const handleRemoveItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const handleImageChange = (index: number, file: File | undefined) => {
    if (file) {
      const updated = [...items];
      updated[index].imageFile = file;
      updated[index].img = URL.createObjectURL(file);
      setItems(updated);
    }
  };

  const handleMoveItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[targetIndex]] = [
      updated[targetIndex],
      updated[index],
    ];
    setItems(updated);
  };

  const handleRotateItem = async (index: number) => {
    const item = items[index];
    if (!item.img) return;
    setRotatingIndex(index);
    try {
      const fileName = item.imageFile?.name || `certificate-${index}.png`;
      const { url, file } = await rotateImageSource(item.img, fileName);
      const updated = [...items];
      updated[index] = { ...updated[index], img: url, imageFile: file };
      setItems(updated);
    } catch {
      alert("Không thể xoay ảnh này, vui lòng thử tải ảnh khác.");
    } finally {
      setRotatingIndex(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-4xl bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-gray-700"
    >
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Cấu hình Chứng nhận (Certificates & Awards)
          </h3>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#0a1b35] text-white rounded-lg text-sm font-semibold hover:bg-[#0a1b35]/90 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save size={16} />
          {loading ? "Đang xử lý..." : "Lưu thay đổi"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-100 pb-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Tiêu đề (Tiếng Việt)
          </label>
          <input
            type="text"
            name="titleVi"
            required
            value={titleVi}
            onChange={(e) => setTitleVi(e.target.value)}
            className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Tiêu đề (Tiếng Anh)
          </label>
          <input
            type="text"
            name="titleEn"
            required
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Mô tả (Tiếng Việt)
          </label>
          <textarea
            name="descVi"
            rows={2}
            value={descVi}
            onChange={(e) => setDescVi(e.target.value)}
            className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Mô tả (Tiếng Anh)
          </label>
          <textarea
            name="descEn"
            rows={2}
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Chữ trên nút bấm
          </label>
          <input
            type="text"
            name="buttonText"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Đường dẫn nút bấm
          </label>
          <input
            type="text"
            name="buttonHref"
            placeholder="https://..."
            value={buttonHref}
            onChange={(e) => setButtonHref(e.target.value)}
            className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-1 text-xs font-semibold text-[#c29b57] hover:text-[#c29b57]/80 cursor-pointer"
        >
          <Plus size={16} /> Thêm chứng nhận mới
        </button>
      </div>

      <div>
        <p className="text-lg font-bold text-gray-800">Danh sách chứng nhận</p>
        <p className="mt-1 text-xs">
          Kích thước khuyến nghị: 900 x 1200 px (Tỷ lệ 3:4, dưới 2MB)
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-xl border border-gray-200 relative flex flex-col items-center"
          >
            <div className="relative w-full aspect-3/4 border border-gray-300 rounded-lg bg-white overflow-hidden flex items-center justify-center mb-2">
              {item.img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.img}
                  alt="Certificate"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span className="text-[10px] text-gray-400">Trống</span>
              )}
            </div>

            <div className="flex items-center gap-1 mb-1">
              <button
                type="button"
                onClick={() => handleMoveItem(index, -1)}
                disabled={index === 0}
                className="p-1.5 bg-white border border-gray-300 text-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
              >
                <ChevronLeft size={12} />
              </button>
              <button
                type="button"
                onClick={() => handleRotateItem(index)}
                disabled={!item.img || rotatingIndex === index}
                className="px-2 py-1 bg-white border border-gray-300 text-gray-700 text-[10px] rounded cursor-pointer hover:bg-gray-50 font-medium flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RotateCw size={10} />
                {rotatingIndex === index ? "..." : "Xoay"}
              </button>
              <button
                type="button"
                onClick={() => handleMoveItem(index, 1)}
                disabled={index === items.length - 1}
                className="p-1.5 bg-white border border-gray-300 text-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer"
              >
                <ChevronRight size={12} />
              </button>
            </div>

            <label className="px-2 py-1 bg-white border border-gray-300 text-gray-700 text-[10px] rounded cursor-pointer hover:bg-gray-50 font-medium flex items-center gap-1 mb-1">
              <Upload size={10} /> Tải ảnh
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(index, e.target.files?.[0])}
              />
            </label>

            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="absolute top-2 right-2 p-1.5 text-red-500 bg-white/90 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}
