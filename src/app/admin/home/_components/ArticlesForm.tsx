"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Upload,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CategoryItem {
  id?: string;
  vi: string;
  en: string;
}

interface ArticlePageItem {
  id?: string;
  src: string;
  imageFile?: File | null;
}

interface ArticleItem {
  id?: string;
  tempId?: string;
  row: number;
  title: string;
  description: string;
  categoryIds: string[];
  date: string;
  publisher: string;
  link: string;
  img: string;
  imageFile?: File | null;
  pages: ArticlePageItem[];
}

interface ArticlesConfigData {
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
  categories: CategoryItem[];
  row1: ArticleItem[];
  row2: ArticleItem[];
}

interface ArticlesFormProps {
  initialData: ArticlesConfigData | null;
  onSave: (
    formData: FormData,
    categories: CategoryItem[],
    articles: ArticleItem[],
  ) => Promise<void>;
}

const generateTempId = () => `temp-${Date.now()}-${Math.random()}`;

const emptyArticle = (row: number): ArticleItem => ({
  tempId: generateTempId(),
  row,
  title: "",
  description: "",
  categoryIds: [],
  date: "",
  publisher: "",
  link: "#",
  img: "",
  imageFile: null,
  pages: [],
});

export function ArticlesForm({ initialData, onSave }: ArticlesFormProps) {
  const [titleVi, setTitleVi] = useState(initialData?.titleVi || "");
  const [titleEn, setTitleEn] = useState(initialData?.titleEn || "");
  const [descVi, setDescVi] = useState(initialData?.descVi || "");
  const [descEn, setDescEn] = useState(initialData?.descEn || "");

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    return (initialData?.categories || []).map((cat, idx) => ({
      ...cat,
      id: cat.id || `cat-${idx}-${Date.now()}`,
    }));
  });

  const [articles, setArticles] = useState<ArticleItem[]>(() => {
    const raw = [...(initialData?.row1 || []), ...(initialData?.row2 || [])];
    return raw.map((item) => ({
      ...item,
      tempId: item.id || generateTempId(),
    }));
  });

  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await onSave(formData, categories, articles);
    setLoading(false);
  };

  const handleAddCategory = () =>
    setCategories((prev) => [
      ...prev,
      { id: `cat-${Date.now()}`, vi: "", en: "" },
    ]);

  const handleRemoveCategory = (index: number) => {
    const targetCat = categories[index];
    if (!targetCat) return;

    setCategories((prev) => prev.filter((_, i) => i !== index));

    if (targetCat.id) {
      const catId = targetCat.id;
      setArticles((prev) =>
        prev.map((a) => ({
          ...a,
          categoryIds: (a.categoryIds || []).filter((id) => id !== catId),
        })),
      );
    }
  };

  const handleCategoryChange = (
    index: number,
    key: keyof CategoryItem,
    value: string,
  ) => {
    setCategories((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleCategoryToggle = (articleIndex: number, catId: string) => {
    setArticles((prev) =>
      prev.map((art, i) => {
        if (i !== articleIndex) return art;
        const currentIds = art.categoryIds || [];
        const updatedIds = currentIds.includes(catId)
          ? currentIds.filter((id) => id !== catId)
          : [...currentIds, catId];
        return { ...art, categoryIds: updatedIds };
      }),
    );
  };

  const handleAdd = (row: number) =>
    setArticles((prev) => [...prev, emptyArticle(row)]);

  const handleRemove = (index: number) =>
    setArticles((prev) => prev.filter((_, i) => i !== index));

  const handleChange = (
    index: number,
    key: keyof ArticleItem,
    value: string,
  ) => {
    setArticles((prev) =>
      prev.map((art, i) => (i === index ? { ...art, [key]: value } : art)),
    );
  };

  const handleImageChange = (index: number, file: File | undefined) => {
    if (!file) return;
    setArticles((prev) =>
      prev.map((art, i) => {
        if (i !== index) return art;
        if (art.img && art.img.startsWith("blob:")) {
          URL.revokeObjectURL(art.img);
        }
        return {
          ...art,
          imageFile: file,
          img: URL.createObjectURL(file),
        };
      }),
    );
  };

  const handleAddPage = (articleIndex: number) => {
    setArticles((prev) =>
      prev.map((art, i) =>
        i === articleIndex
          ? { ...art, pages: [...art.pages, { src: "", imageFile: null }] }
          : art,
      ),
    );
  };

  const handleRemovePage = (articleIndex: number, pageIndex: number) => {
    setArticles((prev) =>
      prev.map((art, i) => {
        if (i !== articleIndex) return art;
        const pageToRemove = art.pages[pageIndex];
        if (pageToRemove?.src?.startsWith("blob:")) {
          URL.revokeObjectURL(pageToRemove.src);
        }
        return {
          ...art,
          pages: art.pages.filter((_, pIdx) => pIdx !== pageIndex),
        };
      }),
    );
  };

  const handlePageImageChange = (
    articleIndex: number,
    pageIndex: number,
    file: File | undefined,
  ) => {
    if (!file) return;
    setArticles((prev) =>
      prev.map((art, i) => {
        if (i !== articleIndex) return art;
        const newPages = art.pages.map((p, pIdx) => {
          if (pIdx !== pageIndex) return p;
          if (p.src && p.src.startsWith("blob:")) {
            URL.revokeObjectURL(p.src);
          }
          return {
            ...p,
            imageFile: file,
            src: URL.createObjectURL(file),
          };
        });
        return { ...art, pages: newPages };
      }),
    );
  };

  const renderRow = (row: number, label: string) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold text-gray-700">{label}</h4>
        <button
          type="button"
          onClick={() => handleAdd(row)}
          className="flex items-center gap-1 text-xs font-semibold text-[#c29b57] hover:text-[#c29b57]/80 cursor-pointer"
        >
          <Plus size={16} /> Thêm bài viết
        </button>
      </div>

      {articles
        .map((a, idx) => ({ a, idx }))
        .filter(({ a }) => a.row === row)
        .map(({ a, idx }) => {
          const itemKey = a.id || a.tempId || `art-${idx}`;
          const isExpanded = expandedId === itemKey;

          return (
            <div
              key={itemKey}
              className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-3 flex flex-col items-center">
                  <span className="text-[10px] text-gray-400 block mb-2 text-center">
                    Ảnh đại diện (tỉ lệ 16:9, khuyến nghị 800 x 450px, dưới 1MB)
                  </span>
                  <div className="relative w-full aspect-video border border-gray-300 rounded-lg bg-white overflow-hidden flex items-center justify-center mb-2">
                    {a.img ? (
                      <img
                        src={a.img}
                        alt="Article"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">Trống</span>
                    )}
                  </div>
                  <label className="px-2 py-1 bg-white border border-gray-300 text-gray-700 text-[10px] rounded cursor-pointer hover:bg-gray-50 font-medium flex items-center gap-1">
                    <Upload size={10} /> Tải ảnh
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageChange(idx, e.target.files?.[0])
                      }
                    />
                  </label>
                </div>

                <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <span className="text-xs text-gray-400 block mb-1">
                      Tiêu đề bài viết
                    </span>
                    <input
                      required
                      value={a.title}
                      onChange={(e) =>
                        handleChange(idx, "title", e.target.value)
                      }
                      className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs text-gray-400 block mb-1">
                      Mô tả ngắn
                    </span>
                    <textarea
                      rows={2}
                      value={a.description}
                      onChange={(e) =>
                        handleChange(idx, "description", e.target.value)
                      }
                      className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">
                      Danh mục (Có thể chọn nhiều)
                    </span>
                    <div className="flex flex-wrap gap-2 p-2 bg-white rounded-lg border border-gray-300 min-h-9.5">
                      {categories.map((c, cIdx) => {
                        const categoryId = c.id || `cat-${cIdx}`;
                        const isChecked = (a.categoryIds || []).includes(
                          categoryId,
                        );

                        return (
                          <label
                            key={categoryId}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs cursor-pointer transition-colors ${
                              isChecked
                                ? "bg-[#0a1b35] text-white font-medium"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isChecked}
                              onChange={() =>
                                handleCategoryToggle(idx, categoryId)
                              }
                            />
                            {c.vi || "(chưa đặt tên)"}
                          </label>
                        );
                      })}

                      {categories.length === 0 && (
                        <span className="text-[10px] text-red-400 self-center">
                          Chưa có danh mục, thêm ở phần Quản lý danh mục phía
                          trên.
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">
                      Ngày đăng (vd: 20/05/2024)
                    </span>
                    <input
                      value={a.date}
                      onChange={(e) =>
                        handleChange(idx, "date", e.target.value)
                      }
                      className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">
                      Đơn vị xuất bản
                    </span>
                    <input
                      value={a.publisher}
                      onChange={(e) =>
                        handleChange(idx, "publisher", e.target.value)
                      }
                      className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-1">
                      Link ngoài (nếu có)
                    </span>
                    <input
                      value={a.link}
                      onChange={(e) =>
                        handleChange(idx, "link", e.target.value)
                      }
                      className="text-gray-800 w-full bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : itemKey)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#0a1b35] cursor-pointer"
                >
                  {isExpanded ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                  Ảnh trang lật ({a.pages.length} trang)
                </button>

                {isExpanded && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {a.pages.map((p, pIdx) => (
                      <div
                        key={p.id || `page-${pIdx}`}
                        className="relative border border-gray-300 rounded-lg bg-white p-2"
                      >
                        <span className="text-[9px] text-gray-400 block mb-1 text-center">
                          Tỉ lệ 3:4, khuyến nghị 900 x 1200px, dưới 1MB
                        </span>
                        <div className="relative w-full aspect-3/4 bg-gray-100 rounded overflow-hidden mb-1">
                          {p.src ? (
                            <img
                              src={p.src}
                              alt={`Page ${pIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[9px] text-gray-400 flex items-center justify-center h-full">
                              Trống
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <label className="px-1.5 py-1 bg-gray-50 border border-gray-300 text-gray-700 text-[9px] rounded cursor-pointer hover:bg-gray-100 flex items-center gap-1">
                            <Upload size={9} /> Tải
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handlePageImageChange(
                                  idx,
                                  pIdx,
                                  e.target.files?.[0],
                                )
                              }
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemovePage(idx, pIdx)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddPage(idx)}
                      className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#c29b57] hover:border-[#c29b57] aspect-3/4 cursor-pointer"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-gray-200 pt-3">
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  <Trash2 size={14} /> Xóa bài viết
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-4xl bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Cấu hình Bài viết đã xuất bản (Published Articles)
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
        <div className="md:col-span-2">
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
        <div className="md:col-span-2">
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
      </div>

      <div className="border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-bold text-gray-700">Quản lý danh mục</h4>
          <button
            type="button"
            onClick={handleAddCategory}
            className="flex items-center gap-1 text-xs font-semibold text-[#c29b57] hover:text-[#c29b57]/80 cursor-pointer"
          >
            <Plus size={16} /> Thêm danh mục
          </button>
        </div>
        <div className="space-y-2">
          {categories.map((c, idx) => (
            <div
              key={c.id || `cat-input-${idx}`}
              className="flex gap-2 items-center"
            >
              <input
                placeholder="Tên danh mục (VI)"
                value={c.vi}
                onChange={(e) =>
                  handleCategoryChange(idx, "vi", e.target.value)
                }
                className="text-gray-800 flex-1 bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
              />
              <input
                placeholder="Category name (EN)"
                value={c.en}
                onChange={(e) =>
                  handleCategoryChange(idx, "en", e.target.value)
                }
                className="text-gray-800 flex-1 bg-white rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-[#0a1b35]"
              />
              <button
                type="button"
                onClick={() => handleRemoveCategory(idx)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-xs text-gray-400 italic">
              Chưa có danh mục nào.
            </p>
          )}
        </div>
      </div>

      {renderRow(1, "Hàng 1 (Row 1)")}
      {renderRow(2, "Hàng 2 (Row 2)")}
    </form>
  );
}
