import Link from "next/link";
import { CategoryBadge, TagBadge } from "@/components/common";
import type { PostMeta } from "@/types/post";
import { cn } from "@/lib/utils";

interface PostCardProps {
    post: PostMeta;
    className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
    return (
        <Link
            href={`/posts/${post.slug}`}
            className={cn(
                "group flex w-full flex-col items-start rounded-lg border border-graphite-200 bg-white dark:border-graphite-800 dark:bg-graphite-900 p-4 text-left transition-all",
                "hover:border-celadon-500/50 hover:bg-graphite-50 dark:hover:bg-graphite-850",
                "focus:outline-none focus:ring-2 focus:ring-celadon-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-graphite-950",
                className
            )}
        >
            <div className="mb-3 flex items-center gap-2">
                <CategoryBadge category={post.category} />
            </div>

            <h3 className="mb-2 line-clamp-2 text-base font-semibold text-graphite-900 dark:text-graphite-50 transition-colors group-hover:text-celadon-400">
                {post.title}
            </h3>

            <p className="mb-3 line-clamp-2 text-sm text-graphite-500 dark:text-graphite-400">
                {post.description}
            </p>

            {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                    {post.tags.slice(0, 3).map((tag) => (
                        <TagBadge key={tag} tag={tag} />
                    ))}
                    {post.tags.length > 3 && (
                        <span className="text-xs text-graphite-400 dark:text-graphite-500">
                            +{post.tags.length - 3}
                        </span>
                    )}
                </div>
            )}
        </Link>
    );
}
