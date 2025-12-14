import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getPostImage } from '@/lib/blog-utils';
import { ArrowRight, Plus } from 'lucide-react';
import { UpcomingEventCard } from '@/components/UpcomingEventCard';
import { EventCard } from '@/components/EventCard';
import { SimpleHeader } from '@/components/headers/SimpleHeader';
import { LoadMore } from '@/components/LoadMore';
import { getDictionary } from '@/get-dictionary';
import { getIsAdmin } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export default async function BlogPage({ params, searchParams }: { params: Promise<{ lang: string }>, searchParams: Promise<{ location?: string }> }) {
    const { lang } = await params;
    const dict: any = await getDictionary(lang as 'de' | 'en');
    const { location } = await searchParams;
    const locationFilter = location;
    const where = locationFilter && locationFilter !== 'Alle' ? { location: locationFilter } : {};

    const isAdmin = await getIsAdmin();

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const publicWhere = {
        ...where,
        published: true
    };

    const upcomingPosts = await prisma.post.findMany({
        where: {
            ...publicWhere,
            eventDate: { gte: now }
        },
        orderBy: { eventDate: 'asc' }
    });

    const INITIAL_LIMIT = 12;

    const pastPosts = await prisma.post.findMany({
        where: {
            ...publicWhere,
            eventDate: { lt: now }
        },
        orderBy: { eventDate: 'desc' },
        take: INITIAL_LIMIT
    });

    const draftPosts = isAdmin ? await prisma.post.findMany({
        where: {
            ...where,
            published: false
        },
        orderBy: { id: 'desc' }
    }) : [];

    const hasAnyPosts = upcomingPosts.length > 0 || pastPosts.length > 0;

    // Fetch distinct locations for dynamic usage
    const distinctLocations = await prisma.post.findMany({
        select: { location: true },
        distinct: ['location'],
        orderBy: { location: 'asc' }
    });

    // Create sorted list of locations, starting with 'Alle'
    const locations = ['Alle', ...distinctLocations
        .map((p: any) => p.location)
        .filter((l: string) => l && l !== 'Alle')];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Header with Filters */}
            <SimpleHeader
                title={dict.news.title}
                subtitle={dict.news.subtitle}
            >
                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3">
                    {locations.map((loc) => (
                        <Link
                            key={loc}
                            href={loc === 'Alle' ? `/${lang}/news` : `/${lang}/news?location=${loc}`}
                            className={`px-6 py-2.5 text-sm font-bold uppercase tracking-wide transition-all border ${(location === loc || (loc === 'Alle' && !location))
                                ? 'bg-gmrt-blue text-white border-gmrt-blue'
                                : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-gmrt-blue border-slate-200 hover:border-gmrt-blue/30'
                                }`}
                        >
                            {loc}
                        </Link>
                    ))}

                    {isAdmin && (
                        <Link
                            href={`/${lang}/create`}
                            className="w-auto px-6 py-2.5 bg-gmrt-salmon text-white from-gmrt-salmon to-gmrt-logo bg-gradient-to-r hover:opacity-90 shadow-sm transition-all flex items-center justify-center rounded-lg ml-2 font-bold uppercase tracking-wide text-sm gap-2"
                            title={dict.news.create_button}
                        >
                            <Plus size={18} />
                            <span>{lang === 'de' ? 'Post erstellen' : 'Create Post'}</span>
                        </Link>
                    )}
                </div>
            </SimpleHeader >

            {!hasAnyPosts ? (
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
                    <div className="text-center py-24 bg-slate-50 border border-slate-200">

                        <p className="text-xl text-slate-500 mb-8">{dict.news.no_events}</p>
                        {isAdmin && (
                            <Link
                                href={`/${lang}/create`}
                                className="inline-flex bg-gmrt-salmon text-white px-8 py-4 hover:bg-gmrt-logo transition-all font-bold uppercase tracking-wider"
                            >
                                {dict.news.create_first}
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* Upcoming Events Section */}
                    {upcomingPosts.length > 0 && (
                        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20">
                            <h2 className="text-2xl font-bold text-gmrt-blue mb-8 flex items-center">
                                <span className="w-2 h-8 bg-gmrt-salmon mr-3 rounded-sm"></span>
                                {dict.news.upcoming}
                            </h2>
                            <div className="flex flex-col gap-12">
                                {upcomingPosts.map((post: any) => (
                                    <UpcomingEventCard key={post.id} post={post} lang={lang} isAdmin={isAdmin} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Past Events Section - White Background */}
            {
                hasAnyPosts && (
                    <div className="py-20 bg-white border-t border-slate-100">
                        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                            {pastPosts.length > 0 && (
                                <>
                                    <h2 className="text-2xl font-bold text-gmrt-blue mb-8 flex items-center">
                                        <span className="w-2 h-8 bg-slate-300 mr-3 rounded-sm"></span>
                                        {dict.news.past}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {pastPosts.map((post: any) => (
                                            <EventCard key={post.id} post={post} lang={lang} isAdmin={isAdmin} />
                                        ))}
                                    </div>

                                    <LoadMore
                                        initialPage={2}
                                        lang={lang}
                                        location={locationFilter}
                                        type="past"
                                        isAdmin={isAdmin}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
