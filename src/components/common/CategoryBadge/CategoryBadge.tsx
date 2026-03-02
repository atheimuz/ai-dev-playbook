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
    활용: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700/50",
    학습: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/50 dark:text-violet-300 dark:border-violet-700/50"
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
