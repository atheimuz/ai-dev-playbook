import { BentoCard } from "../BentoCard";
import type { PostMeta } from "@/types/post";

interface BentoGridProps {
    posts: PostMeta[];
    selectedSlug?: string | null;
}

const CARD_SPANS = [
    "md:col-span-4 md:row-span-2", // 카드1(최신): 가장 넓은 영역
    "md:col-span-2 md:row-span-1", // 카드2
    "md:col-span-2 md:row-span-1", // 카드3
    "md:col-span-2 md:row-span-1", // 카드4
    "md:col-span-4 md:row-span-1" // 카드5
];

export function BentoGrid({ posts, selectedSlug }: BentoGridProps) {
    if (posts.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-6">
            {posts.slice(0, 5).map((post, index) => (
                <BentoCard
                    key={post.slug}
                    post={post}
                    isSelected={selectedSlug === post.slug}
                    className={CARD_SPANS[index] || "md:col-span-2 md:row-span-1"}
                />
            ))}
        </div>
    );
}
