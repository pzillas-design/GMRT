import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { BlogCarousel } from '@/components/BlogCarousel';
import { ArrowRight } from 'lucide-react';
import { getPostImage } from '@/lib/blog-utils';
import { InfoAccordion } from '@/components/InfoAccordion';
import { UpcomingEventCard } from '@/components/UpcomingEventCard';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { GridTiles } from '@/components/GridTiles';
import { getDictionary } from '@/get-dictionary';

export const dynamic = 'force-dynamic';

export default async function Home({ params, searchParams }: { params: Promise<{ lang: string }>, searchParams: Promise<{ location?: string }> }) {
  const { lang } = await params;
  const dict: any = await getDictionary(lang as 'de' | 'en');
  const { location } = await searchParams;
  const locationFilter = location;
  const where = locationFilter && locationFilter !== 'Alle' ? { location: locationFilter } : {};

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  const locations = ['Alle', 'Düsseldorf', 'Frankfurt', 'München'];

  const upcomingPosts = posts.filter((post: any) => new Date(post.eventDate) >= new Date())
    .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, 3); // Show top 3 upcoming

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <Hero dict={dict.homepage} lang={lang} />

        {/* Features Section */}
        <Features dict={dict.homepage} />

        {/* Impact / Tiles Section */}
        <GridTiles dict={dict.homepage} />

        {/* Upcoming Events Section (Replaces Carousel) */}
        {upcomingPosts.length > 0 && (
          <section className="py-24 bg-slate-50">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
              <div className="flex justify-between items-end mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gmrt-blue">
                  {dict.homepage.upcoming.title}
                </h2>
                <Link href={`/${lang}/news`} className="text-gmrt-salmon font-semibold hover:text-gmrt-blue transition-colors flex items-center gap-2">
                  {dict.homepage.past.read_more /* reusing read_more or similar */} <ArrowRight size={20} />
                </Link>
              </div>

              <div className="flex flex-col gap-12">
                {upcomingPosts.map((post: any) => (
                  <UpcomingEventCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
      <InfoAccordion />
    </>
  );
}
