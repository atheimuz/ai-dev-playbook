"use client";

import { CATEGORIES, type Category } from "@/types/post";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    selectedCategory: Category | null;
    onSelect: (category: Category | null) => void;
    className?: string;
}

export function CategoryFilter({ selectedCategory, onSelect, className }: CategoryFilterProps) {
    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            <button
                onClick={() => onSelect(null)}
                className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium cursor-pointer transition-colors",
                    selectedCategory === null
                        ? "bg-celadon-600 text-white"
                        : "bg-graphite-50 text-graphite-600 hover:bg-graphite-100 dark:bg-graphite-800 dark:text-graphite-300 dark:hover:bg-graphite-700"
                )}
            >
                전체
            </button>
            {CATEGORIES.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelect(category)}
                    className={cn(
                        "rounded-full px-4 py-1.5 text-sm font-medium cursor-pointer transition-colors",
                        selectedCategory === category
                            ? "bg-celadon-500 text-graphite-950"
                            : "bg-graphite-50 text-graphite-600 hover:bg-graphite-100 dark:bg-graphite-800 dark:text-graphite-300 dark:hover:bg-graphite-700"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
