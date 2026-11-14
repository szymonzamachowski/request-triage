import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Markdown({ children }: { children: string }) {
  return (
    <div
      className="prose prose-neutral prose-sm max-w-none
        prose-headings:tracking-tight prose-h2:mt-10 prose-h2:border-t prose-h2:border-neutral-100 prose-h2:pt-8 prose-h2:text-base
        [&>h2:first-child]:mt-0 [&>h2:first-child]:border-0 [&>h2:first-child]:pt-0
        prose-h3:text-sm prose-blockquote:border-neutral-300 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:text-neutral-700
        prose-table:text-sm prose-th:font-medium prose-li:my-0.5
        [&_blockquote_p:first-of-type]:before:content-none [&_blockquote_p:last-of-type]:after:content-none"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
