import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <article
      className={cn("prose-custom", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
