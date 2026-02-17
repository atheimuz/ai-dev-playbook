import type { Category } from "@/types/post";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
    category: Category;
    className?: string;
}

const CATEGORY_STYLES: Record<Category, string> = {
    설정: "bg-fern-100 text-fern-700 border-fern-200 dark:bg-fern-800/50 dark:text-fern-300 dark:border-fern-700/50",
    문제해결:
        "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-700/50",
    개선: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/50 dark:text-sky-300 dark:border-sky-700/50",
    팁: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/50 dark:text-violet-300 dark:border-violet-700/50"
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                CATEGORY_STYLES[category],
                className
            )}
        >
            {category}
        </span>
    );
}
