"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Upload } from "lucide-react";
import { AvatarCropper } from "@/app/admin/_components/AvatarCropper";
import type { RecommendationItemParam } from "../types";

interface RecommendationsConfigData {
  id?: string;
  titleVi: string;
  subtitle: string;
  descVi: string;
  items: RecommendationItemParam[];
}

interface RecommendationsFormProps {
  initialData: RecommendationsConfigData | null;
  onSave: (
    formData: FormData,
    items: RecommendationItemParam[],
  ) => Promise<void>;
}

export function RecommendationsForm({
  initialData,
  onSave,
}: RecommendationsFormProps) {
  const [titleVi, setTitleVi] = useState(
    initialData?.titleVi || "RECOMMENDATIONS",
  );
  const [subtitle, setSubtitle] = useState(
    initialData?.subtitle || "Chia sẻ từ Lãnh đạo, Đối tác & Cấp quản lý",
  );
  const [descVi, setDescVi] = useState(initialData?.descVi || "");
  const [items, setItems] = useState<RecommendationItemParam[]>(
    initialData?.items || [],
  );
  const [cropTargetIndex, setCropTargetIndex] = useState<number | null>(null);
  const [cropSource, setCropSource] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await onSave(formData, items);
    setLoading(false);
  };

  const handleAddItem = () =>
    setItems([
      ...items,
      {
        name: "",
        roleLine1: "",
        roleLine2: "",
        timeAgo: "",
        quote: "",
        avatar: "",
        imageFile: null,
      },
    ]);

  const handleRemoveItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const handleItemChange = (
    index: number,
    key: keyof RecommendationItemParam,
    value: string,
  ) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [key]: value,
    } as RecommendationItemParam;
    setItems(updated);
  };

  const handleAvatarPick = (index: number, file: File | undefined) => {
    if (!file) return;
    setCropTargetIndex(index);
    setCropSource(file);
  };

  const handleCropConfirm = (blob: Blob) => {
    if (cropTargetIndex === null) return;
    const croppedFile = new File([blob], "avatar.png", { type: "image/png" });
    const updated = [...items];
    updated[cropTargetIndex] = {
      ...updated[cropTargetIndex],
      imageFile: croppedFile,
      avatar: URL.createObjectURL(croppedFile),
    };
    setItems(updated);
    setCropSource(null);
    setCropTargetIndex(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-4xl bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Cấu hình Recommendations
        </h3>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#0a1b35] text-white rounded-lg text-sm font-semibold hover:bg-[#0a1b35]/90 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save size={16} />
          {loading ? "Đang xử lý..." : "Lưu thay đổi"}
        </button>
      </div>

      <div className="space-y-4 border-b border-gray-100 pb-4">
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Tiêu đề mục
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
            Phụ đề
          </label>
          <input
            type="text"
            name="subtitle"
            required
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">
            Mô tả
          </label>
          <textarea
            name="descVi"
            rows={2}
            value={descVi}
            onChange={(e) => setDescVi(e.target.value)}
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
          <Plus size={16} /> Thêm đánh giá mới
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
          >
            <div className="md:col-span-2 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border border-gray-300 bg-white overflow-hidden flex items-center justify-center mb-2">
                {item.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.avatar}
                    alt={item.name || ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[9px] text-gray-400">Trống</span>
                )}
              </div>
              <label className="px-2 py-1 bg-white border border-gray-300 text-gray-700 text-[10px] rounded cursor-pointer hover:bg-gray-50 font-medium flex items-center gap-1">
                <Upload size={10} /> Tải ảnh
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarPick(index, e.target.files?.[0])}
                />
              </label>
            </div>

            <div className="md:col-span-5 space-y-2">
              <input
                placeholder="Họ tên"
                value={item.name || ""}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
              />
              <input
                placeholder="Chức danh dòng 1"
                value={item.roleLine1 || ""}
                onChange={(e) =>
                  handleItemChange(index, "roleLine1", e.target.value)
                }
                className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
              />
              <input
                placeholder="Chức danh dòng 2"
                value={item.roleLine2 || ""}
                onChange={(e) =>
                  handleItemChange(index, "roleLine2", e.target.value)
                }
                className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
              />
              <input
                placeholder="Thời gian (vd: 2 tháng trước)"
                value={item.timeAgo || ""}
                onChange={(e) =>
                  handleItemChange(index, "timeAgo", e.target.value)
                }
                className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
              />
            </div>

            <div className="md:col-span-4">
              <textarea
                placeholder="Nội dung đánh giá"
                rows={5}
                value={item.quote || ""}
                onChange={(e) =>
                  handleItemChange(index, "quote", e.target.value)
                }
                className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
              />
            </div>

            <div className="md:col-span-1 flex justify-end md:pt-6">
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {cropSource && (
        <AvatarCropper
          file={cropSource}
          onCancel={() => {
            setCropSource(null);
            setCropTargetIndex(null);
          }}
          onConfirm={handleCropConfirm}
        />
      )}
    </form>
  );
}
