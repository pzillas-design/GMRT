import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Edit2 } from 'lucide-react';
import { ContentRenderer } from '@/components/ContentRenderer';
import { ContentBlock } from '@/types';
import { getDictionary } from '@/get-dictionary';
import { getPostImage } from '@/lib/blog-utils';
import { ImageHeader } from '@/components/headers/ImageHeader';
import { Metadata } from 'next';

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
                <div className="flex flex-wrap items-center gap-6 text-base text-white/90 font-medium">
                    <div className="flex items-center gap-2 uppercase tracking-widest">
                        {new Date(post.eventDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-gmrt-salmon"></span>
                    <div className="uppercase tracking-widest">
                        {post.location || 'Allgemein'}
                    </div>
                </div>
            </ImageHeader>

            <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-24 min-h-screen bg-white">
                <ContentRenderer blocks={blocks} />

                {/* Edit Button (End of Post, Subtle) */}
                <div className="flex justify-end mt-16 pt-8 border-t border-slate-50">
                    <Link
                        href={`/edit/${post.id}`}
                        className="flex items-center gap-2 text-slate-300 hover:text-gmrt-blue transition-colors group"
                        title="Beitrag bearbeiten"
                    >
                        <span className="text-xs font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Bearbeiten</span>
                        <Edit2 size={18} />
                    </Link>
                </div>
            </div>
        </article >
    );
}
