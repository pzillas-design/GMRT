
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetCovers() {
    console.log('Resetting cover images to NULL to enforce city defaults...');

    // Update all posts to have no cover image, so they fall back to getPostImage(location)
    const { count } = await prisma.post.updateMany({
        data: {
            coverImage: null
        }
    });

    console.log(`Reset cover images for ${count} posts.`);
}

resetCovers();
