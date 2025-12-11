import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();
const CONTENT_FILE = path.join(process.cwd(), 'data', 'legacy-content.json');

const MONTHS: Record<string, string> = {
    'Januar': '01', 'Februar': '02', 'März': '03', 'April': '04', 'Mai': '05', 'Juni': '06',
    'Juli': '07', 'August': '08', 'September': '09', 'Oktober': '10', 'November': '11', 'Dezember': '12',
    'January': '01', 'February': '02', 'March': '03', 'May': '05', 'June': '06',
    'July': '07', 'October': '10', 'December': '12'
};

function parseDate(dateStr: string | null): Date {
    if (!dateStr) return new Date();

    // Clean up
    let clean = dateStr.trim();

    // Format: "18.09.2025"
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(clean)) {
        const parts = clean.split('.');
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }

    // Format: "September 30, 2021"
    const usMatch = clean.match(/([a-zA-Z]+)\s+(\d{1,2}),\s+(\d{4})/);
    if (usMatch) {
        const month = MONTHS[usMatch[1]] || '01';
        const day = usMatch[2].padStart(2, '0');
        const year = usMatch[3];
        return new Date(`${year}-${month}-${day}`);
    }

    // Format: "23. Februar 2021"
    const deMatch = clean.match(/(\d{1,2})\.\s+([a-zA-ZäöüÄÖÜ]+)\s+(\d{4})/);
    if (deMatch) {
        const month = MONTHS[deMatch[2]] || '01';
        const day = deMatch[1].padStart(2, '0');
        const year = deMatch[3];
        return new Date(`${year}-${month}-${day}`);
    }

    // Fallback: try default parser
    const valid = new Date(clean);
    if (!isNaN(valid.getTime())) return valid;

    return new Date();
}

async function seedLegacy() {
    try {
        const contentRaw = await fs.readFile(CONTENT_FILE, 'utf-8');
        const posts = JSON.parse(contentRaw);

        console.log(`Seeding ${posts.length} legacy posts...`);

        // Collect definitions of posts we are about to import
        const newTitles = posts.map((p: any) => p.title);

        // 1. Cleanup by flag (fastest)
        await prisma.post.deleteMany({
            where: { isLegacy: true }
        });

        // 2. Cleanup by title (catches zombies from intermediate runs)
        await prisma.post.deleteMany({
            where: {
                title: { in: newTitles }
            }
        });

        console.log('Cleared existing legacy posts (by flag and title match).');

        for (const post of posts) {
            // Transform blocks to include IDs
            const blocks = post.blocks.map((b: any) => ({
                ...b,
                id: crypto.randomUUID()
            }));

            // Map location name if needed (standardize)
            let location = post.location;
            // Ensure capitalization
            location = location.charAt(0).toUpperCase() + location.substring(1).toLowerCase();
            // Fix umlauts if missing (though scraper handled it)
            if (location === 'Duesseldorf') location = 'Düsseldorf';
            if (location === 'Muenchen') location = 'München';
            if (location === 'Koeln') location = 'Köln';

            // Generate summary for content field
            let summary = 'Imported from gmrt.de';
            const firstTextBlock = blocks.find((b: any) => b.type === 'text');
            if (firstTextBlock && firstTextBlock.content) {
                summary = firstTextBlock.content.substring(0, 200) + (firstTextBlock.content.length > 200 ? '...' : '');
            }

            await prisma.post.create({
                data: {
                    title: post.title,
                    content: summary,
                    contentBlocks: JSON.stringify(blocks),
                    location: location,
                    eventDate: parseDate(post.date),
                    coverImage: post.coverImage || null,
                    isLegacy: true
                }
            });
            console.log(`Imported: ${post.title}`);
        }

        console.log('Legacy migration complete!');

    } catch (error) {
        console.error('Error seeding legacy data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedLegacy();
