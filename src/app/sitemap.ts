import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://gmrt.de'; // Replace with actual domain whenever deployed

    // Static pages (Localized)
    const routes = [
        '',
        '/about',
        '/contact',
        '/news',
        '/impressum',
    ].flatMap((route) => [
        {
            url: `${baseUrl}/de${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        },
        {
            url: `${baseUrl}/en${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: route === '' ? 1 : 0.8,
        },
    ]);

    // Dynamic posts
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            createdAt: true,
        },
    });

    const postRoutes = posts.flatMap((post) => [
        {
            url: `${baseUrl}/de/news/${post.id}`,
            lastModified: post.createdAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/en/news/${post.id}`,
            lastModified: post.createdAt,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
    ]);

    return [...routes, ...postRoutes];
}
