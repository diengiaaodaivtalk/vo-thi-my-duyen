"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { updateSiteCtaAction } from "../actions";

interface SiteCtaData {
  primaryTitle: string | null;
  primaryDesc: string | null;
  primaryBtn1Label: string | null;
  primaryBtn1Href: string | null;
  primaryBtn2Label: string | null;
  primaryBtn2Href: string | null;
  secondaryTitle: string | null;
  secondaryDesc: string | null;
  secondaryBtnLabel: string | null;
  secondaryBtnHref: string | null;
}

export function SiteCtaForm({ initialData }: { initialData: SiteCtaData }) {
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    await updateSiteCtaAction(formData);
    setSaving(false);
    setSavedMsg("Đã lưu thay đổi");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const inputClass =
    "text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]";
  const label = "text-xs font-semibold text-gray-700 block mb-1";

  return (
    <form
      action={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Cấu hình banner CTA cuối trang (dùng chung cho các bài đăng)
        </h3>
        <div className="flex items-center gap-3">
          {savedMsg && (
            <span className="text-xs text-green-600">{savedMsg}</span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#0a1b35] text-white rounded-lg text-sm font-semibold hover:bg-[#0a1b35]/90 disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-base font-bold text-[#8a6a3f]">Banner 1</h4>
        <div>
          <span className={label}>Tiêu đề</span>
          <textarea
            name="primaryTitle"
            rows={2}
            defaultValue={initialData.primaryTitle || ""}
            className={inputClass}
          />
        </div>
        <div>
          <span className={label}>Mô tả</span>
          <textarea
            name="primaryDesc"
            rows={2}
            defaultValue={initialData.primaryDesc || ""}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className={label}>Nhãn nút 1</span>
            <input
              name="primaryBtn1Label"
              defaultValue={initialData.primaryBtn1Label || ""}
              className={inputClass}
            />
          </div>
          <div>
            <span className={label}>Đường dẫn nút 1</span>
            <input
              name="primaryBtn1Href"
              defaultValue={initialData.primaryBtn1Href || ""}
              className={inputClass}
            />
          </div>
          <div>
            <span className={label}>Nhãn nút 2</span>
            <input
              name="primaryBtn2Label"
              defaultValue={initialData.primaryBtn2Label || ""}
              className={inputClass}
            />
          </div>
          <div>
            <span className={label}>Đường dẫn nút 2</span>
            <input
              name="primaryBtn2Href"
              defaultValue={initialData.primaryBtn2Href || ""}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h4 className="text-base font-bold text-[#8a6a3f]">Banner 2</h4>
        <div>
          <span className={label}>Tiêu đề</span>
          <input
            name="secondaryTitle"
            defaultValue={initialData.secondaryTitle || ""}
            className={inputClass}
          />
        </div>
        <div>
          <span className={label}>Mô tả</span>
          <textarea
            name="secondaryDesc"
            rows={2}
            defaultValue={initialData.secondaryDesc || ""}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className={label}>Nhãn nút</span>
            <input
              name="secondaryBtnLabel"
              defaultValue={initialData.secondaryBtnLabel || ""}
              className={inputClass}
            />
          </div>
          <div>
            <span className={label}>Đường dẫn nút</span>
            <input
              name="secondaryBtnHref"
              defaultValue={initialData.secondaryBtnHref || ""}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
