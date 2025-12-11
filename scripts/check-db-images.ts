
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            coverImage: true
        }
    });

    console.log(`Checking ${posts.length} posts in DB:`);
    posts.forEach(p => {
        console.log(`[${p.id}] ${p.title.substring(0, 30)}... -> Cover: ${p.coverImage ? 'YES' : 'NO'} (${p.coverImage})`);
    });
}

check();
