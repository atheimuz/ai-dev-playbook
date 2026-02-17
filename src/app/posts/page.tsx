import type { Metadata } from "next";
import { getAllPostMetas } from "@/lib/posts";
import { PostListPageClient } from "@/components/features/Blog";

export const metadata: Metadata = {
  title: "포스팅",
  description: "AI 에이전트 활용 경험, 설정 가이드, 문제 해결 팁을 모아봤습니다.",
};

export default function PostsPage() {
  const posts = getAllPostMetas();

  return <PostListPageClient posts={posts} />;
}
