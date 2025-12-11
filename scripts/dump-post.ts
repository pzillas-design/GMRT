
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
        console.log(`--- POST ${post.id} ---`);
        console.log(post.contentBlocks);
        console.log(`--- END ---`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
