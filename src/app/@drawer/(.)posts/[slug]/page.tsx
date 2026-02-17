import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { PostDrawer } from "@/components/features/Blog/PostDrawer";

interface DrawerPageProps {
    params: Promise<{ slug: string }>;
}

export default async function DrawerPostPage({ params }: DrawerPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return <PostDrawer post={post} />;
}
