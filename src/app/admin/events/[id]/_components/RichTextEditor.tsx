"use client";

import { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  ImagePlus,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  Palette,
} from "lucide-react";
import { uploadEditorImageAction } from "../../actions";
import { FontSize } from "./FontSizeExtension";

const FONT_OPTIONS = [
  { label: "Mặc định", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "'Helvetica Neue', Arial, sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Open Sans", value: "'Open Sans', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  {
    label: "Segoe UI",
    value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  { label: "Inter", value: "'Inter', sans-serif" },

  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Merriweather", value: "'Merriweather', serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },

  { label: "Be Vietnam Pro", value: "'Be Vietnam Pro', sans-serif" },
  { label: "Dancing Script (Viết tay)", value: "'Dancing Script', cursive" },
  { label: "Roboto Mono (Mã nguồn)", value: "'Roboto Mono', monospace" },
];

const FONT_SIZE_OPTIONS = [
  { label: "Cỡ chữ", value: "" },
  { label: "6px", value: "6px" },
  { label: "8px", value: "8px" },
  { label: "10px", value: "10px" },
  { label: "11px", value: "11px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "64px", value: "64px" },
];

const COLOR_OPTIONS = [
  "#000000",
  "#434343",
  "#666666",
  "#DC2626",
  "#EA580C",
  "#D97706",
  "#16A34A",
  "#2563EB",
  "#7C3AED",
];

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ImageExtension.configure({
        HTMLAttributes: { class: "w-full rounded-md my-4 block" },
      }),
      LinkExtension.configure({ openOnClick: false }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] px-5 py-4 text-sm text-gray-800 leading-7 outline-none prose prose-sm max-w-none",
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        const imageItem = Array.from(items).find((item) =>
          item.type.startsWith("image/"),
        );
        if (!imageItem) return false;
        const file = imageItem.getAsFile();
        if (!file) return false;
        event.preventDefault();
        const localUrl = URL.createObjectURL(file);
        editor?.chain().focus().setImage({ src: localUrl }).run();
        uploadEditorImageAction(file).then((uploadedUrl) => {
          const html = editor?.getHTML().replace(localUrl, uploadedUrl) || "";
          editor?.commands.setContent(html);
          onChange(html);
        });
        return true;
      },
    },
  });

  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `w-8 h-8 flex items-center justify-center rounded-md border text-gray-600 cursor-pointer shrink-0 ${
      active
        ? "bg-[#0a1b35] text-white border-[#0a1b35]"
        : "bg-white border-gray-200 hover:bg-gray-50"
    }`;

  const selectClass =
    "h-8 text-xs border border-gray-200 rounded-md bg-white text-gray-600 px-1 cursor-pointer";

  const handleImagePick = () => fileInputRef.current?.click();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    editor.chain().focus().setImage({ src: localUrl }).run();
    const uploadedUrl = await uploadEditorImageAction(file);
    const html = editor.getHTML().replace(localUrl, uploadedUrl);
    editor.commands.setContent(html);
    onChange(html);
  };

  const currentColor = editor.getAttributes("textStyle").color || "#000000";

  return (
    <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-1.5 p-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
        <button
          type="button"
          className={btnClass(false)}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo size={15} />
        </button>
        <button
          type="button"
          className={btnClass(false)}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo size={15} />
        </button>

        <div className="w-px bg-gray-200 mx-1 h-5" />

        <select
          className={selectClass}
          onChange={(e) =>
            e.target.value
              ? editor.chain().focus().setFontFamily(e.target.value).run()
              : editor.chain().focus().unsetFontFamily().run()
          }
          defaultValue=""
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          onChange={(e) =>
            e.target.value
              ? editor.chain().focus().setFontSize(e.target.value).run()
              : editor.chain().focus().unsetFontSize().run()
          }
          defaultValue=""
        >
          {FONT_SIZE_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <label
            className="w-6 h-6 flex items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-100 cursor-pointer transition-colors relative"
            title="Chọn màu tùy chỉnh"
          >
            <Palette size={14} className="text-gray-600" />
            <input
              type="color"
              value={currentColor}
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </label>

          <div className="w-px bg-gray-200 mx-0.5 h-4" />

          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => editor.chain().focus().setColor(c).run()}
              className="w-5 h-5 rounded-full border border-gray-200 cursor-pointer shrink-0 hover:scale-110 transition-transform"
              style={{ background: c }}
            />
          ))}

          <button
            type="button"
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="text-[10px] text-gray-400 underline ml-1 cursor-pointer"
          >
            Xóa màu
          </button>
        </div>

        <div className="w-px bg-gray-200 mx-1 h-5" />

        <button
          type="button"
          className={btnClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          className={btnClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          className={btnClass(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon size={15} />
        </button>
        <button
          type="button"
          className={btnClass(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={15} />
        </button>

        <div className="w-px bg-gray-200 mx-1 h-5" />

        <button
          type="button"
          className={btnClass(editor.isActive("heading", { level: 2 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          className={btnClass(editor.isActive("heading", { level: 3 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={15} />
        </button>
        <button
          type="button"
          className={btnClass(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={15} />
        </button>

        <div className="w-px bg-gray-200 mx-1 h-5" />

        <button
          type="button"
          className={btnClass(editor.isActive({ textAlign: "left" }))}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={15} />
        </button>
        <button
          type="button"
          className={btnClass(editor.isActive({ textAlign: "center" }))}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={15} />
        </button>
        <button
          type="button"
          className={btnClass(editor.isActive({ textAlign: "right" }))}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={15} />
        </button>
        <button
          type="button"
          className={btnClass(editor.isActive({ textAlign: "justify" }))}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify size={15} />
        </button>

        <div className="w-px bg-gray-200 mx-1 h-5" />

        <button
          type="button"
          className={btnClass(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </button>
        <button
          type="button"
          className={btnClass(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </button>

        <div className="w-px bg-gray-200 mx-1 h-5" />

        <button
          type="button"
          className={btnClass(false)}
          onClick={() => {
            const url = prompt("Nhập đường dẫn liên kết");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon size={15} />
        </button>
        <button
          type="button"
          className={btnClass(false)}
          onClick={handleImagePick}
        >
          <ImagePlus size={15} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        <span className="ml-auto self-center text-xs text-gray-400 pr-1 hidden md:inline">
          Ảnh tối đa 1600px, dưới 2MB
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
