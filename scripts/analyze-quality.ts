
import fs from 'fs/promises';
import path from 'path';

const CONTENT_FILE = path.join(process.cwd(), 'data', 'legacy-content.json');

async function analyze() {
    const raw = await fs.readFile(CONTENT_FILE, 'utf-8');
    const posts = JSON.parse(raw);

    console.log(`Analyzing ${posts.length} posts...`);

    posts.forEach((post: any, i: number) => {
        const blocks = post.blocks;
        console.log(`\n[${i}] ${post.title}`);

        // Check 1: Duplicate Title in Content
        if (blocks.length > 0 && blocks[0].type === 'headline' && blocks[0].content.includes(post.title)) {
            console.log(`  WARN: First block might be duplicate title: "${blocks[0].content}"`);
        }

        // Check 2: Short text blocks
        blocks.forEach((b: any, idx: number) => {
            if (b.type === 'text' && b.content.length < 20) {
                console.log(`  WARN: Short text block found [${idx}]: "${b.content}"`);
            }
        });

        // Check 3: "Mehr lesen" or similar clutter
        blocks.forEach((b: any, idx: number) => {
            if (typeof b.content === 'string' && (b.content.toLowerCase().includes('mehr lesen') || b.content.toLowerCase().includes('weiterlesen'))) {
                console.log(`  WARN: Boilerplate link text found [${idx}]: "${b.content}"`);
            }
        });
    });
}

analyze();
