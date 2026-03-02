"use client";

import { cn } from "@/lib/utils";
import { TagBadge } from "@/components/common";

interface TagFilterProps {
    tags: string[];
    selectedTag: string | null;
    onSelect: (tag: string | null) => void;
    className?: string;
}

export function TagFilter({ tags, selectedTag, onSelect, className }: TagFilterProps) {
    if (tags.length === 0) return null;

    return (
        <div className={cn("flex flex-wrap gap-1.5", className)}>
            {tags.map((tag) => (
                <TagBadge
                    key={tag}
                    tag={tag}
                    isActive={selectedTag === tag}
                    onClick={() => onSelect(selectedTag === tag ? null : tag)}
                />
            ))}
        </div>
    );
}
