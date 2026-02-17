"use client";

import { SearchBar } from "../SearchBar";
import { CategoryFilter } from "../CategoryFilter";
import { PostCard } from "../PostCard";
import { EmptyState } from "@/components/common";
import { useFilterPosts, useObserveScroll } from "@/hooks";
import type { PostMeta } from "@/types/post";

interface PostListPageClientProps {
    posts: PostMeta[];
}

export function PostListPageClient({ posts }: PostListPageClientProps) {
    const {
        displayedPosts,
        searchQuery,
        selectedCategory,
        hasMore,
        setSearchQuery,
        setSelectedCategory,
        loadMore
    } = useFilterPosts({ posts });

    const { targetRef } = useObserveScroll({
        onIntersect: loadMore,
        enabled: hasMore
    });

    return (
        <div className="flex-1 px-4 py-8 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8">
                    <h1 className="mb-6 text-3xl font-bold text-graphite-900 dark:text-graphite-50">포스팅</h1>

                    <div className="space-y-4">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            className="max-w-md"
                        />
                        <CategoryFilter
                            selectedCategory={selectedCategory}
                            onSelect={setSelectedCategory}
                        />
                    </div>
                </header>

                {displayedPosts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {displayedPosts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div ref={targetRef} className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-graphite-200 dark:border-graphite-700 border-t-celadon-500" />
                    </div>
                )}
            </div>
        </div>
    );
}
