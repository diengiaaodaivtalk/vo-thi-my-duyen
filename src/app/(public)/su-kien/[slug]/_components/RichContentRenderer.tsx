import DOMPurify from "isomorphic-dompurify";

export function RichContentRenderer({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "h2",
      "h3",
      "span",
      "strong",
      "em",
      "u",
      "s",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "img",
      "br",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "style", "target", "rel"],
  });

  return (
    <div
      className="prose prose-neutral max-w-none text-[15px] leading-8 text-[#3b372f]
        prose-headings:font-bold prose-headings:text-[#0a1b35]
        prose-blockquote:border-l-4 prose-blockquote:border-[#c29b57]
        prose-blockquote:text-[#8a6a3f] prose-blockquote:not-italic
        prose-img:rounded-md prose-a:text-[#c29b57]"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
