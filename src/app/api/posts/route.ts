import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const type = searchParams.get('type'); // 'upcoming' | 'past'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12'); // 12 fits grid of 2, 3, 4 nicely
    const skip = (page - 1) * limit;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let dateFilter: any = {};
    let orderBy: any = { createdAt: 'desc' };

    if (type === 'upcoming') {
        dateFilter = { eventDate: { gte: now } };
        orderBy = { eventDate: 'asc' };
    } else if (type === 'past') {
        dateFilter = { eventDate: { lt: now } };
        orderBy = { eventDate: 'desc' };
    }

    const where = {
        ...(location && location !== 'Alle' ? { location } : {}),
        ...dateFilter
    };

    try {
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            prisma.post.count({ where })
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

import { cookies } from 'next/headers';

// ...

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get('gmrt_auth_token');

        if (authToken?.value !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, location, eventDate, contentBlocks } = body;

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content: content || '',
                location: location || 'Allgemein',
                eventDate: eventDate ? new Date(eventDate) : new Date(),
                contentBlocks: typeof contentBlocks !== 'string' ? JSON.stringify(contentBlocks || []) : contentBlocks,
                coverImage: body.coverImage || null,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
