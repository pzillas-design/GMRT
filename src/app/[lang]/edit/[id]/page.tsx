import { PostEditor } from '@/components/PostEditor';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string, lang: string }> }) {
    const { id, lang } = await params;
    const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
    });

    if (!post) {
        notFound();
    }

    // Parse content blocks if available, otherwise fallback to empty array
    let contentBlocks = [];
    try {
        contentBlocks = JSON.parse(post.contentBlocks || '[]');
        if (contentBlocks.length === 0 && post.content) {
            contentBlocks = [{ id: 'legacy', type: 'text', content: post.content }];
        }
    } catch (e) {
        if (post.content) {
            contentBlocks = [{ id: 'legacy', type: 'text', content: post.content }];
        }
    }

    const initialData = {
        title: post.title,
        location: post.location || 'Allgemein',
        eventDate: post.eventDate.toISOString(),
        contentBlocks: contentBlocks,
        coverImage: post.coverImage,
    };

    return <PostEditor initialData={initialData} isEditing={true} postId={id} lang={lang as 'de' | 'en'} />;
}
