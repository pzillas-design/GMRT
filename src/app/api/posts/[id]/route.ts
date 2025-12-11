import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Error fetching post' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Parse payload
        const { id } = await params;
        const body = await request.json();


        const { title, content, location, eventDate, contentBlocks } = body;

        // Validation
        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        // Prepare data for Prisma
        const updateData = {
            title,
            content,
            location,
            eventDate: eventDate ? new Date(eventDate) : undefined,
            contentBlocks: typeof contentBlocks !== 'string' ? JSON.stringify(contentBlocks) : contentBlocks,
            coverImage: body.coverImage || null, // Convert empty string or undefined to null if preferred, or keep as string
        };

        const updatedPost = await prisma.post.update({
            where: { id: parseInt(id) },
            data: updateData,
        });



        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json({ error: 'Error updating post' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.post.delete({
            where: { id: parseInt(id) },
        });


        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Error deleting post' }, { status: 500 });
    }
}
