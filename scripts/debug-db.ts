import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Checking DB Columns (Raw SQL) ---');
    try {
        const result = await prisma.$queryRaw`PRAGMA table_info(Post);`;
        console.log(result);
    } catch (e) {
        console.error('Failed to query table info:', e);
    }

    console.log('\n--- Attempting to create Post with coverImage ---');
    try {
        const post = await prisma.post.create({
            data: {
                title: 'Debug Test Post',
                content: 'Test Content',
                location: 'Debug City',
                eventDate: new Date(),
                contentBlocks: '[]',
                // @ts-ignore - Ignoring TS error to test runtime behavior
                coverImage: 'https://example.com/test.jpg'
            }
        });
        console.log('Success! Created post:', post);
    } catch (e) {
        console.error('FAILED to create post:', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
