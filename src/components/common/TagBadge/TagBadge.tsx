import { cn } from "@/lib/utils";

interface TagBadgeProps {
    tag: string;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
}

export function TagBadge({ tag, isActive = false, onClick, className }: TagBadgeProps) {
    const Component = onClick ? "button" : "span";

    return (
        <Component
            onClick={onClick}
            className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors",
                isActive
                    ? "bg-celadon-500/20 text-celadon-400 border border-celadon-500/30"
                    : "bg-graphite-50 text-graphite-500 border border-graphite-100 dark:bg-graphite-800 dark:text-graphite-400 dark:border-graphite-700",
                onClick &&
                    "cursor-pointer hover:bg-graphite-200 hover:text-graphite-700 dark:hover:bg-graphite-700 dark:hover:text-graphite-200",
                className
            )}
        >
            #{tag}
        </Component>
    );
}
