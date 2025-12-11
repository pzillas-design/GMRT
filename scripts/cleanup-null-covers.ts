
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
    console.log('Cleaning up posts without cover images...');

    const { count } = await prisma.post.deleteMany({
        where: {
            coverImage: null
        }
    });

    console.log(`Deleted ${count} posts with missing cover images.`);

    // Also delete duplicates if any (paranoid check)
    // We can't easy do "delete duplicates" in prisma without raw query or logic
    // But getting rid of nulls should kill the old legacy imports which didn't have this field.
}

cleanup();
