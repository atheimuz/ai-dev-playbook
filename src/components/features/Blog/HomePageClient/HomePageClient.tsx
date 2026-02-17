"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoveRight } from "lucide-react";
import { BentoGrid } from "../BentoGrid";
import type { PostMeta } from "@/types/post";

interface HomePageClientProps {
    posts: PostMeta[];
}

export function HomePageClient({ posts }: HomePageClientProps) {
    const pathname = usePathname();

    // URL에서 현재 선택된 slug 추출 (/posts/[slug])
    const selectedSlug = pathname.startsWith("/posts/") ? pathname.replace("/posts/", "") : null;

    return (
        <div className="flex-1 px-4 py-8 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Hero Section */}
                <section className="pt-10 pb-16">
                    <h1 className="mb-4 text-4xl font-bold text-graphite-900 dark:text-graphite-50 lg:text-5xl">
                        AI Agent Dev Playbook
                    </h1>
                    <p className="max-w-2xl text-lg text-graphite-500 dark:text-graphite-400">
                        AI 에이전트와 함께하는 개발 경험을 기록합니다.
                    </p>
                </section>

                {/* Bento Grid */}
                <BentoGrid posts={posts} selectedSlug={selectedSlug} />

                {/* CTA 버튼 */}
                <div className="mt-12 text-center">
                    <Link
                        href="/posts"
                        className="inline-flex items-center gap-2 rounded-lg border border-graphite-200 dark:border-graphite-700 px-6 py-3 text-graphite-700 dark:text-graphite-200 transition-colors hover:border-celadon-600 hover:text-celadon-600 dark:hover:border-celadon-600 dark:hover:text-celadon-600"
                    >
                        모든 글 보기
                        <span aria-hidden="true">
                            <MoveRight />
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
