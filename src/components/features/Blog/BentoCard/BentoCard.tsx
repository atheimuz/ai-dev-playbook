import Link from "next/link";
import { Plus } from "lucide-react";
import type { PostMeta } from "@/types/post";
import { cn } from "@/lib/utils";

interface BentoCardProps {
    post: PostMeta;
    isSelected?: boolean;
    className?: string;
}

export function BentoCard({ post, isSelected = false, className }: BentoCardProps) {
    return (
        <Link
            href={`/posts/${post.slug}`}
            className={cn(
                "group relative flex min-h-[200px] flex-col justify-between border border-dashed p-6 text-left transition-all",
                "border-graphite-200 dark:border-graphite-700",
                "hover:bg-graphite-100 dark:hover:bg-graphite-700",
                "focus:outline-none focus:ring-2 focus:ring-celadon-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-graphite-950",
                isSelected && "border-celadon-500 border-solid",
                className
            )}
        >
            {/* 4코너 "+" 장식 */}
            <span className="absolute -left-3 -top-3 text-graphite-300 dark:text-graphite-600">
                <Plus size={16} />
            </span>
            <span className="absolute -right-3 -top-3 text-graphite-300 dark:text-graphite-600">
                <Plus size={16} />
            </span>
            <span className="absolute -bottom-3 -left-3 text-graphite-300 dark:text-graphite-600">
                <Plus size={16} />
            </span>
            <span className="absolute -bottom-3 -right-3 text-graphite-300 dark:text-graphite-600">
                <Plus size={16} />
            </span>

            <div>
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-graphite-900 dark:text-graphite-50 transition-colors group-hover:text-celadon-400">
                    {post.title}
                </h3>
                <p className="line-clamp-3 text-sm text-graphite-500 dark:text-graphite-400">{post.description}</p>
            </div>
        </Link>
    );
}
