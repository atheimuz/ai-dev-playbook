"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "../SearchBar";
import { CategoryFilter } from "../CategoryFilter";
import { TagFilter } from "../TagFilter";
import { PostCard } from "../PostCard";
import { EmptyState } from "@/components/common";
import { useFilterPosts, useObserveScroll } from "@/hooks";
import type { PostMeta } from "@/types/post";

interface PostListPageClientProps {
    posts: PostMeta[];
    allTags: string[];
}

export function PostListPageClient({ posts, allTags }: PostListPageClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const {
        displayedPosts,
        searchQuery,
        selectedCategory,
        selectedTag,
        hasMore,
        setSearchQuery,
        setSelectedCategory,
        setSelectedTag,
        loadMore
    } = useFilterPosts({ posts, initialTag: searchParams.get("tag") });

    const { targetRef } = useObserveScroll({
        onIntersect: loadMore,
        enabled: hasMore
    });

    useEffect(() => {
        if (selectedTag) {
            router.replace(`/posts?tag=${encodeURIComponent(selectedTag)}`, { scroll: false });
        } else {
            router.replace("/posts", { scroll: false });
        }
    }, [selectedTag, router]);

    const handleTagClick = (tag: string) => {
        setSelectedTag(selectedTag === tag ? null : tag);
    };

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
                        <TagFilter
                            tags={allTags}
                            selectedTag={selectedTag}
                            onSelect={setSelectedTag}
                        />
                    </div>
                </header>

                {displayedPosts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        {displayedPosts.map((post) => (
                            <PostCard
                                key={post.slug}
                                post={post}
                                selectedTag={selectedTag}
                                onTagClick={handleTagClick}
                            />
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
