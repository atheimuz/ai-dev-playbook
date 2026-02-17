export const CATEGORIES = ["설정", "문제해결", "개선", "팁"] as const;
export type Category = (typeof CATEGORIES)[number];
export type CategoryFilter = "전체" | Category;

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  date: string;
  thumbnail?: string;
}

export interface Post extends PostMeta {
  content: string;
  rawContent: string;
  headings: import("@/lib/posts").TocItem[];
}

export interface PostIndex {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  searchText: string;
}
