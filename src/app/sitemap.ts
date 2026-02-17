import type { MetadataRoute } from "next";
import { getAllPostMetas } from "@/lib/posts";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ai-dev-playbook.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostMetas();

  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...postUrls,
  ];
}
