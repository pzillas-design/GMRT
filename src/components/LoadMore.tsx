'use client';

import { useState, useEffect } from 'react';
import { EventCard } from '@/components/EventCard';
import { Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface LoadMoreProps {
    initialPage?: number;
    lang: string;
    location?: string;
    type: 'upcoming' | 'past';
    isAdmin?: boolean;
}

export function LoadMore({ initialPage = 1, lang, location, type, isAdmin }: LoadMoreProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [ref, inView] = useInView();

    const loadMorePosts = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        const nextPage = page + 1;

        try {
            const params = new URLSearchParams();
            params.set('page', nextPage.toString());
            params.set('limit', '6'); // Load smaller chunks interactively
            params.set('type', type);
            if (location && location !== 'Alle') params.set('location', location);

            const res = await fetch(`/api/posts?${params.toString()}`);
            const data = await res.json();

            if (data.posts.length === 0 || data.pagination.page >= data.pagination.totalPages) {
                setHasMore(false);
            }

            if (data.posts.length > 0) {
                setPosts((prev) => [...prev, ...data.posts]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error('Error loading more posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-trigger when in view
    useEffect(() => {
        if (inView && hasMore) {
            loadMorePosts();
        }
    }, [inView, hasMore]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {posts.map((post: any) => (
                    <EventCard key={post.id} post={post} lang={lang} isAdmin={isAdmin} />
                ))}
            </div>

            <div className="flex justify-center mt-12 w-full" ref={ref}>
                {loading && (
                    <Loader2 className="animate-spin text-gmrt-blue" size={32} />
                )}
                {!hasMore && posts.length > 0 && (
                    <p className="text-slate-400 text-sm italic">Alle Beiträge geladen.</p>
                )}
            </div>
        </>
    );
}
