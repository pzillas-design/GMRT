
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const post = await prisma.post.findFirst({
        where: {
            title: {
                contains: 'Rückblick 1. GMRT Berlin'
            }
        }
    });

    if (post) {
        console.log(`Found Post: ID=${post.id}, Title=${post.title}`);
        console.log(`Images in blocks:`, post.contentBlocks.includes('image'));
    } else {
        console.log("Post not found");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
