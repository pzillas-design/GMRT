import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Edit2 } from 'lucide-react';
import { ContentRenderer } from '@/components/ContentRenderer';
import { ContentBlock } from '@/types';
import { getDictionary } from '@/get-dictionary';
import { getPostImage } from '@/lib/blog-utils';
import { ImageHeader } from '@/components/headers/ImageHeader';
import { PostActions } from '@/components/PostActions';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string, lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
        select: { title: true, location: true, eventDate: true }
    });

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | GMRT`,
        description: `Bericht vom GMRT ${post.location} am ${new Date(post.eventDate).toLocaleDateString('de-DE')}.`,
        openGraph: {
            title: post.title,
            description: `Bericht vom GMRT ${post.location}`,
        }
    };
}

export default async function PostPage({ params }: { params: Promise<{ id: string, lang: string }> }) {
    const { id, lang } = await params;
    const dict: any = await getDictionary(lang as 'de' | 'en');

    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('gmrt_auth_token')?.value === 'authenticated';

    const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
    });

    if (!post) {
        notFound();
    }

    let blocks: ContentBlock[] = [];
    try {
        blocks = JSON.parse(post.contentBlocks || '[]');
    } catch (e) {
        console.error('Failed to parse content blocks', e);
    }

    // Fallback if no blocks but content exists
    if (blocks.length === 0 && post.content) {
        blocks = [{ id: 'legacy', type: 'text', content: post.content }];
    }

    return (
        <article className="min-h-screen bg-white">
            {/* Hero Header */}
            <ImageHeader
                title={post.title}
                backgroundImage={(post as any).coverImage || getPostImage(post.location)}
                backLink={`/${lang}/news`}
                backLabel={dict.news.back_to_news}
            >
                <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-center gap-6 text-base text-white/90 font-medium">
                        <div className="flex items-center gap-2 uppercase tracking-widest">
                            {new Date(post.eventDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-gmrt-salmon"></span>
                        <div className="uppercase tracking-widest">
                            {post.location || 'Allgemein'}
                        </div>
                    </div>
                    <PostActions postId={post.id} lang={lang} isAdmin={isAdmin} />
                </div>
            </ImageHeader>

            <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-24 bg-white">
                <ContentRenderer blocks={blocks} />

                {/* Edit Button (Left Aligned, Boxed, Icon Only) */}

            </div>
        </article >
    );
}
