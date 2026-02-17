"use client";

import { useActiveHeading } from "@/hooks";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/posts";

interface TableOfContentsProps {
  headings: TocItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const headingIds = headings.map((h) => h.id);
  const activeId = useActiveHeading(headingIds);

  if (headings.length === 0) return null;

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <nav aria-label="목차" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-graphite-500 dark:text-graphite-400">
        목차
      </p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={cn(
                "block py-1 leading-snug transition-colors duration-150",
                heading.level === 3 && "pl-3",
                activeId === heading.id
                  ? "font-medium text-celadon-500 dark:text-celadon-400"
                  : "text-graphite-400 hover:text-graphite-700 dark:text-graphite-500 dark:hover:text-graphite-200"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
