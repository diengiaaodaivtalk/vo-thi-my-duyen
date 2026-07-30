export function RichContentRenderer({ html }: { html: string }) {
  return (
    <div
      className="prose prose-neutral max-w-none text-[15px] leading-8 text-[#3b372f]
        prose-headings:font-bold prose-headings:text-[#0a1b35]
        prose-blockquote:border-l-4 prose-blockquote:border-[#c29b57]
        prose-blockquote:text-[#8a6a3f] prose-blockquote:not-italic
        prose-img:rounded-md prose-a:text-[#c29b57]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
