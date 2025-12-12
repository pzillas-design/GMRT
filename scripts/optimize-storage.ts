
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Use dynamic require for sharp to match project style
const requireSharp = () => require('sharp');

const prisma = new PrismaClient();
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

async function getFiles(dir: string): Promise<string[]> {
    let results: string[] = [];
    try {
        const list = await fs.readdir(dir);
        for (const file of list) {
            const filePath = path.join(dir, file);
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
                const res = await getFiles(filePath);
                results = results.concat(res);
            } else {
                results.push(filePath);
            }
        }
    } catch (e) {
        // Directory might not exist
    }
    return results;
}

async function optimizeStorage() {
    console.log('Starting storage optimization...');
    const sharp = requireSharp();

    // 1. Scan uploads
    const allFiles = await getFiles(UPLOADS_DIR);
    console.log(`Found ${allFiles.length} files in uploads.`);

    // Filter for convertible images (jpg, png, jpeg) that are NOT webp
    const imagesToConvert = allFiles.filter(f => {
        const ext = path.extname(f).toLowerCase();
        return (ext === '.jpg' || ext === '.jpeg' || ext === '.png');
    });

    console.log(`Found ${imagesToConvert.length} images to convert to WebP.`);

    // Map of Old Relative URL -> New Relative URL
    const replacements = new Map<string, string>();

    for (const filePath of imagesToConvert) {
        const dir = path.dirname(filePath);
        const ext = path.extname(filePath);
        const name = path.basename(filePath, ext);
        const newFilePath = path.join(dir, `${name}.webp`);

        // Convert
        try {
            console.log(`Converting: ${path.relative(process.cwd(), filePath)}`);
            await sharp(filePath)
                .rotate()
                .webp({ quality: 80 })
                .toFile(newFilePath);

            // Record replacement
            // Relative to public, e.g. /uploads/team/foo.jpg
            const relativeOld = filePath.split('public')[1]; // /uploads/...
            const relativeNew = newFilePath.split('public')[1];
            replacements.set(relativeOld, relativeNew);

            // Mark old for deletion (we'll delete after DB updates)
        } catch (err) {
            console.error(`Failed to convert ${filePath}:`, err);
        }
    }

    // 2. Update Database
    console.log('Updating database references...');
    const posts = await prisma.post.findMany();

    for (const post of posts) {
        let needsUpdate = false;
        let coverImage = post.coverImage;
        let content = post.content;
        let contentBlocksStr = post.contentBlocks as string;
        // Blocks is stored as string in Prisma schema for this project? 
        // Wait, schema says Json usually, but let's check. 
        // In previous view_file, PostEditor uses JSON.stringify(blocks).
        // Let's assume it's a string or Json object. 
        // If it's a string, we replace in string.

        // Helper to replace all occurrences
        const replaceInString = (str: string | null) => {
            if (!str) return str;
            let newStr = str;
            for (const [oldPath, newPath] of replacements) {
                // simple replaceAll
                newStr = newStr.split(oldPath).join(newPath);
            }
            return newStr;
        };

        const newCover = replaceInString(coverImage);
        const newContent = replaceInString(content);

        // Handle blocks
        let newBlocks = contentBlocksStr;
        // If it's stored as JSON object in prisma (handled by client), we might need to stringify it to replace?
        // Actually, if we just treating it as a string for replacement it usually works for URLs.
        if (typeof contentBlocksStr === 'object') {
            const jsonStr = JSON.stringify(contentBlocksStr);
            const newJsonStr = replaceInString(jsonStr) as string;
            newBlocks = JSON.parse(newJsonStr);
        } else {
            newBlocks = replaceInString(contentBlocksStr) as string;
        }

        if (newCover !== coverImage || newContent !== content || newBlocks !== contentBlocksStr) {
            console.log(`Updating Post ${post.id}`);
            await prisma.post.update({
                where: { id: post.id },
                data: {
                    coverImage: newCover,
                    content: newContent,
                    contentBlocks: newBlocks as any
                }
            });
        }
    }

    // 3. Delete old files
    console.log('Deleting old source files...');
    for (const filePath of imagesToConvert) {
        try {
            await fs.unlink(filePath);
        } catch (e) { }
    }

    // 4. Bloat Cleanup (Test files)
    console.log('Cleaning up known test garbage...');
    const bloatFiles = allFiles.filter(f => f.includes('test-image') || f.includes('test-large'));
    for (const f of bloatFiles) {
        try {
            // Check if it still exists (might have been converted/deleted above)
            // If we converted it, we deleted the .jpg, but we created a .webp "test" file.
            // We want to delete the .webp too if it's bloat.
            // So we check for *any* file matching bloat pattern now.
            await fs.unlink(f).catch(() => { });
            // Also try removing the generated webp if we made one
            const ext = path.extname(f);
            const webp = f.replace(ext, '.webp');
            await fs.unlink(webp).catch(() => { });
        } catch (e) { }
    }

    console.log('Optimization complete.');
}

optimizeStorage()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
