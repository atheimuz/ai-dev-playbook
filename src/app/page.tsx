import { getLatestPosts } from "@/lib/posts";
import { HomePageClient } from "@/components/features/Blog";

export default function HomePage() {
  const posts = getLatestPosts(6);

  return <HomePageClient posts={posts} />;
}
