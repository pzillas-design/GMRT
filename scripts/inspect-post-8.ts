import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const post = await prisma.post.findUnique({
        where: { id: 8 },
    });

    if (!post) {
        console.log('Post 8 not found');
        return;
    }

    console.log('Post 8 Content:', JSON.stringify(post.content, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
