
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanTitles() {
    console.log('Starting title cleanup...');

    const posts = await prisma.post.findMany();
    let updatedCount = 0;

    for (const post of posts) {
        let newTitle = post.title;

        // Pattern 1: Remove leading dates (e.g., "30.09.2021 Review..." or "2021-09-30 ...")
        // Regex: Start of string, optional date chars, optional separators, optional whitespace
        newTitle = newTitle.replace(/^\d{2}\.\d{2}\.\d{4}\s*[-–:]*\s*/, '');
        newTitle = newTitle.replace(/^\d{4}-\d{2}-\d{2}\s*[-–:]*\s*/, '');

        // Pattern 2: Simplify "Review [Number] GMRT [City]"
        // Example: "Review 19th GMRT Düsseldorf" -> "19. GMRT Düsseldorf" (German style) or keep as is?
        // User asked: "Review 19th GMRT Düsseldorf / 2nd Düsseldorf GMRT Digital 30.09.2021 is redundant"
        // Let's try to strip the date at the end too.
        newTitle = newTitle.replace(/\s*\d{2}\.\d{2}\.\d{4}$/, '');

        // Pattern 3: Remove "Review" prefix if it's followed by "Xth GMRT" and replace with something cleaner?
        // Or just keep it but remove the date.
        // User example: "Review 19th GMRT Düsseldorf / 2nd Düsseldorf GMRT Digital 30.09.2021"
        // Desired: "19. GMRT Düsseldorf / 2. GMRT Digital" (Assumed based on "unify form")

        // Let's replace "Review" with nothing if it's at the start, or "Rückblick"
        // But user said "Review ... is redundant... bring into uniform form 19. GMRT".
        if (newTitle.startsWith('Review ')) {
            newTitle = newTitle.replace(/^Review\s+/, '');
        }

        // Replace English ordinals with German dot? "19th" -> "19."
        newTitle = newTitle.replace(/(\d+)(st|nd|rd|th)\s+GMRT/, '$1. GMRT');

        if (newTitle !== post.title) {
            console.log(`Updating: \n  Old: "${post.title}"\n  New: "${newTitle}"`);
            await prisma.post.update({
                where: { id: post.id },
                data: { title: newTitle }
            });
            updatedCount++;
        }
    }

    console.log(`Cleanup complete. Updated ${updatedCount} posts.`);
}

cleanTitles()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
