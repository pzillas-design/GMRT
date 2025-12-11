'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getPostImage } from '@/lib/blog-utils';

type Post = {
    id: string;
    title: string;
    content: string;
    location: string | null;
    createdAt: Date;
};

export function BlogCarousel({ posts }: { posts: Post[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % posts.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    };

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
                <p className="text-slate-500 mb-4">Noch keine Beiträge vorhanden.</p>
                <Link
                    href="/create"
                    className="inline-flex bg-gmrt-salmon text-white px-6 py-2 rounded hover:bg-gmrt-logo transition-colors"
                >
                    Beitrag erstellen
                </Link>
            </div>
        );
    }

    // Determine how many items to show based on screen width (simplified logic for SSR safety, usually we'd use a hook or CSS grid)
    // For this simplified carousel, we'll show one main item on mobile, and maybe 2-3 on desktop using a window/slice approach,
    // OR just a simple single-item slider that is very prominent.
    // Let's go with a 3-item view for desktop if possible, or just a simple scroll container.

    // Actually, a simple horizontal scroll with snap is often better than a JS carousel for "simplified".
    // Let's try a CSS-first approach with buttons to scroll.

    return (
        <div className="relative group">
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
                {posts.map((post) => (
                    <div key={post.id} className="min-w-[70vw] md:min-w-[300px] snap-center flex-shrink-0">
                        <Link href={`/posts/${post.id}`} className="group/card cursor-pointer block h-full bg-white border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col">
                            <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                                <img
                                    src={(post as any).coverImage || getPostImage(post.location)}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gmrt-blue shadow-sm">
                                        {post.location || 'Blog'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="mb-3">
                                    <p className="text-xs font-semibold text-gmrt-salmon uppercase tracking-wide">
                                        {new Date(post.createdAt).toLocaleDateString('de-DE')}
                                    </p>
                                </div>
                                <h3 className="text-xl font-bold text-gmrt-blue leading-tight group-hover/card:text-gmrt-logo transition-colors mb-3 line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-grow">
                                    {post.content}
                                </p>
                                <div className="flex items-center text-gmrt-blue font-medium text-sm group-hover/card:text-gmrt-salmon transition-colors">
                                    Mehr lesen
                                    <svg className="w-4 h-4 ml-2 transition-transform group-hover/card:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}

                {/* "More" card */}
                <div className="min-w-[200px] md:min-w-[250px] snap-center flex-shrink-0 flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 hover:border-gmrt-blue hover:bg-blue-50 transition-colors cursor-pointer group/more">
                    <Link href="/blog" className="text-center p-6 w-full h-full flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gmrt-blue mb-4 shadow-sm group-hover/more:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                        <span className="font-bold text-gmrt-blue group-hover/more:text-gmrt-salmon transition-colors">Alle Beiträge ansehen</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
