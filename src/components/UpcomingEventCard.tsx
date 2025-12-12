import Link from 'next/link';
import Image from 'next/image';
import { getPostImage } from '@/lib/blog-utils';

interface UpcomingEventCardProps {
    post: {
        id: string | number;
        title: string;
        content: string | null;
        location: string | null;
        eventDate: Date | string;
        coverImage?: string | null;
    };
    lang?: string;
}

export function UpcomingEventCard({ post, lang = 'de' }: UpcomingEventCardProps) {
    const dateLocale = lang === 'en' ? 'en-US' : 'de-DE';

    return (
        <Link href={`/${lang}/posts/${post.id}`} className="group cursor-pointer block bg-slate-50 transition-all duration-300 flex flex-col md:flex-row min-h-[400px] hover:bg-slate-100 active:bg-slate-200">
            <div className="md:w-5/12 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-200">
                    <Image
                        src={(post as any).coverImage || getPostImage(post.location)}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 40vw"
                    />
                </div>
            </div>
            <div className="p-10 md:w-7/12 flex flex-col justify-center">
                <div className="mb-6 flex items-center gap-4">
                    <p className="text-sm font-bold text-gmrt-salmon uppercase tracking-wide flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {new Date(post.eventDate).toLocaleDateString(dateLocale, { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <span className="bg-gmrt-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gmrt-blue rounded-sm">
                        {post.location || 'Event'}
                    </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gmrt-blue leading-tight group-hover:text-gmrt-logo transition-colors mb-6">
                    {post.title}
                </h3>
                <p className="text-slate-600 text-lg line-clamp-3">
                    {post.content}
                </p>
            </div>
        </Link>
    );
}
