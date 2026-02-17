"use client";

import { useState, useMemo, useCallback } from "react";
import type { PostMeta, Category } from "@/types/post";

interface UseFilterPostsProps {
  posts: PostMeta[];
  initialPageSize?: number;
}

interface UseFilterPostsReturn {
  filteredPosts: PostMeta[];
  displayedPosts: PostMeta[];
  searchQuery: string;
  selectedCategory: Category | null;
  selectedTag: string | null;
  hasMore: boolean;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedTag: (tag: string | null) => void;
  loadMore: () => void;
  reset: () => void;
}

export function useFilterPosts({
  posts,
  initialPageSize = 9,
}: UseFilterPostsProps): UseFilterPostsReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(initialPageSize);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === null || post.category === selectedCategory;

      const matchesTag =
        selectedTag === null || post.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [posts, searchQuery, selectedCategory, selectedTag]);

  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, displayCount);
  }, [filteredPosts, displayCount]);

  const hasMore = displayedPosts.length < filteredPosts.length;

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => prev + initialPageSize);
  }, [initialPageSize]);

  const reset = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedTag(null);
    setDisplayCount(initialPageSize);
  }, [initialPageSize]);

  return {
    filteredPosts,
    displayedPosts,
    searchQuery,
    selectedCategory,
    selectedTag,
    hasMore,
    setSearchQuery,
    setSelectedCategory,
    setSelectedTag,
    loadMore,
    reset,
  };
}
