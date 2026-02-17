"use client";

import { Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagBadge, MarkdownRenderer } from "@/components/common";
import { useDrawer } from "./DrawerContext";
import type { Post } from "@/types/post";

interface PostDrawerProps {
    post: Post;
}

export function PostDrawer({ post }: PostDrawerProps) {
    const { handleClose } = useDrawer();

    const handleOpenFullPage = () => {
        window.location.href = `/posts/${post.slug}`;
    };

    return (
        <>
            <header className="flex items-center justify-between px-6 py-4">
                <Button variant="ghost" size="icon" onClick={handleOpenFullPage} title="전체 페이지로 보기">
                    <Expand className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleClose} title="닫기">
                    <X className="h-5 w-5" />
                </Button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
                <h2 className="mb-2 text-2xl font-bold text-graphite-900 dark:text-graphite-50">
                    {post.title}
                </h2>
                <p className="mb-6 text-graphite-500 dark:text-graphite-400">{post.description}</p>

                {post.tags.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <TagBadge key={tag} tag={tag} />
                        ))}
                    </div>
                )}

                <div className="border-t border-graphite-200 dark:border-graphite-800 pt-6">
                    <MarkdownRenderer content={post.content} />
                </div>
            </div>
        </>
    );
}
