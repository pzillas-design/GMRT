import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'legacy-content.json');
const OUTPUT_FILE = path.join(DATA_DIR, 'legacy-content-final.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'legacy');

async function downloadImage(url: string, destDir: string): Promise<string | null> {
    try {
        // Create hash of URL to use as filename (avoids special chars issues)
        const ext = path.extname(url).split('?')[0] || '.jpg';
        const hash = crypto.createHash('md5').update(url).digest('hex');
        const filename = `${hash}${ext}`;
        const filePath = path.join(destDir, filename);

        // Check if exists
        try {
            await fs.access(filePath);
            return `/uploads/legacy/${filename}`;
        } catch {
            // Download if not exists
        }

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer'
        });

        await fs.writeFile(filePath, response.data);
        // console.log(`Downloaded ${url} to ${filename}`);

        return `/uploads/legacy/${filename}`;
    } catch (error) {
        console.error(`Failed to download ${url}:`, error instanceof Error ? error.message : String(error));
        return null; // Keep original URL or empty? user said "if possible". 
        // If fail, we might return null and handle it by filtering the block or keeping original
        // Let's return null to signal failure
    }
}

async function processImages() {
    try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });

        const contentRaw = await fs.readFile(CONTENT_FILE, 'utf-8');
        const posts = JSON.parse(contentRaw);

        console.log(`Processing images for ${posts.length} posts...`);

        for (const [index, post] of posts.entries()) {
            console.log(`[${index + 1}/${posts.length}] Processing ${post.title}...`);

            // Process blocks
            for (const block of post.blocks) {
                if (block.type === 'image' && block.content && block.content.startsWith('http')) {
                    const localPath = await downloadImage(block.content, UPLOADS_DIR);
                    if (localPath) {
                        block.content = localPath;
                    } else {
                        console.warn(`Could not download image for post ${post.title}. Keeping original URL.`);
                    }
                }
            }
        }

        await fs.writeFile(OUTPUT_FILE, JSON.stringify(posts, null, 2));
        console.log(`Saved updated content to ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Error processing images:', error);
    }
}

processImages();
