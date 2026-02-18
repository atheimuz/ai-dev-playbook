import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllSlugs } from "@/lib/posts";
import { CategoryBadge, TagBadge, MarkdownRenderer } from "@/components/common";
import { TableOfContents } from "@/components/features/Blog";
import { Button } from "@/components/ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ai-dev-playbook.vercel.app";

interface PostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return { title: "포스팅을 찾을 수 없습니다" };
    }

    return {
        title: post.title,
        description: post.description,
        keywords: post.tags,
        openGraph: {
            title: post.title,
            description: post.description,
            type: "article",
            url: `${BASE_URL}/posts/${slug}`,
            publishedTime: new Date(post.date).toISOString(),
            authors: ["AI Dev Playbook"],
            tags: post.tags,
            ...(post.thumbnail && { images: [post.thumbnail] })
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            ...(post.thumbnail && { images: [post.thumbnail] })
        }
    };
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: new Date(post.date).toISOString(),
        author: {
            "@type": "Person",
            name: "AI Dev Playbook"
        },
        publisher: {
            "@type": "Organization",
            name: "AI Dev Playbook"
        },
        url: `${BASE_URL}/posts/${slug}`,
        keywords: post.tags,
        ...(post.thumbnail && { image: post.thumbnail })
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="relative lg:grid lg:grid-cols-[1fr_220px] lg:gap-10 xl:grid-cols-[1fr_250px]">
                <article className="overflow-hidden">
                    <Button asChild variant="ghost" className="mb-4">
                        <Link href="/posts">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            목록으로
                        </Link>
                    </Button>

                    <header className="mb-8">
                        <div className="mb-4">
                            <CategoryBadge category={post.category} />
                        </div>

                        <h1 className="mb-4 text-3xl font-bold text-graphite-900 dark:text-graphite-50 lg:text-4xl">
                            {post.title}
                        </h1>

                        <p className="mb-4 text-lg text-graphite-500 dark:text-graphite-400">
                            {post.description}
                        </p>

                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <TagBadge key={tag} tag={tag} />
                                ))}
                            </div>
                        )}
                    </header>

                    <div className="border-t border-graphite-100 dark:border-graphite-800 pt-8">
                        <MarkdownRenderer content={post.content} />
                    </div>
                </article>

                {post.headings.length > 0 && (
                    <aside className="hidden lg:block">
                        <div className="sticky top-8 max-h-[calc(100vh-6rem)] overflow-y-auto">
                            <TableOfContents headings={post.headings} />
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
