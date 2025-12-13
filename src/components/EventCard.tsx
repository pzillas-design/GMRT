import Link from 'next/link';
import Image from 'next/image';
import { getPostImage } from '@/lib/blog-utils';
import { AdminCardActions } from '@/components/AdminCardActions';

interface EventCardProps {
    post: {
        id: string | number;
        title: string;
        content: string | null;
        location: string | null;
        eventDate: Date | string;
    };
    lang?: string;
    isAdmin?: boolean;
}

export function EventCard({ post, lang = 'de', isAdmin }: EventCardProps) {
    const dateLocale = lang === 'en' ? 'en-US' : 'de-DE';

    return (
        <div className="relative group isolate h-full bg-slate-50 transition-all duration-300 hover:bg-slate-100 active:bg-slate-200 flex flex-col border border-transparent hover:border-slate-200/50">
            <Link href={`/${lang}/posts/${post.id}`} className="cursor-pointer block flex flex-col flex-grow">
                <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                    <Image
                        src={getPostImage(post.location)}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {new Date(post.eventDate).toLocaleDateString(dateLocale, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                        <span className="bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 rounded-sm">
                            {post.location || 'Blog'}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gmrt-blue leading-tight group-hover:text-gmrt-logo transition-colors mb-3">
                        {post.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2 flex-grow">
                        {post.content}
                    </p>
                </div>
            </Link>
            {isAdmin && (
                <div className="px-6 pb-6">
                    <AdminCardActions postId={post.id} lang={lang} />
                </div>
            )}
        </div>
    );
}
