"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2, GripVertical, Pencil, Eye, EyeOff } from "lucide-react";
import {
  createEventAction,
  deleteEventAction,
  reorderEventsAction,
} from "../actions";
import type { EventItemParam } from "../types";

export function EventListTable({ items }: { items: EventItemParam[] }) {
  const [list, setList] = useState(items);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pending, setPending] = useState(false);

  const handleDrop = async (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...list];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    setList(next);
    setDragIndex(null);
    await reorderEventsAction(next.map((i) => i.id as string));
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Xóa bài viết này? Hành động không thể hoàn tác.")) return;
    setList((prev) => prev.filter((i) => i.id !== id));
    await deleteEventAction(id);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800">
          Danh sách Hoạt động & Sự kiện
        </h3>
        <form
          action={async () => {
            setPending(true);
            await createEventAction();
          }}
        >
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 px-4 py-2 bg-[#c29b57] text-white rounded-lg text-sm font-semibold hover:bg-[#c29b57]/90 disabled:opacity-50 cursor-pointer"
          >
            <Plus size={16} />
            {pending ? "Đang tạo..." : "Thêm bài viết mới"}
          </button>
        </form>
      </div>

      {list.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-10">
          Chưa có bài viết nào.
        </p>
      )}

      <div className="space-y-2">
        {list.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
          >
            <GripVertical size={16} className="text-gray-400 cursor-grab shrink-0" />
            <div className="w-16 h-11 rounded-md overflow-hidden bg-white border border-gray-200 shrink-0">
              {item.coverImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.coverImg}
                  alt={item.titleVi}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {item.titleVi}
              </p>
              <p className="text-xs text-gray-400">
                {item.eventDate} · {item.eventTime}
              </p>
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-1 rounded-full flex items-center gap-1 shrink-0 ${
                item.published
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {item.published ? <Eye size={12} /> : <EyeOff size={12} />}
              {item.published ? "Đã đăng" : "Bản nháp"}
            </span>
            <Link
              href={`/admin/events/${item.id}`}
              className="p-2 text-gray-500 hover:bg-white rounded-lg border border-gray-200 shrink-0"
            >
              <Pencil size={14} />
            </Link>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-gray-200 shrink-0 cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
