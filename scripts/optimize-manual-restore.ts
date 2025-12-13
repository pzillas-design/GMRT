import fs from 'fs/promises';
import path from 'path';

// Use dynamic require for sharp to match project style
const requireSharp = () => require('sharp');

const TEAM_DIR = path.join(process.cwd(), 'public/uploads/team');

async function optimizeRestored() {
    console.log('Optimizing restored images...');
    const sharp = requireSharp();

    try {
        const files = await fs.readdir(TEAM_DIR);
        for (const file of files) {
            // Process only the _orig files we just downloaded
            if (file.includes('_orig')) {
                const filePath = path.join(TEAM_DIR, file);

                // Determine target name (remove _orig and ensure .webp)
                // e.g. jai-shankar_orig.jpg -> jai-shankar.webp
                const name = file.split('_orig')[0];
                const targetPath = path.join(TEAM_DIR, `${name}.webp`);

                console.log(`Converting ${file} -> ${name}.webp (Original Aspect Ratio)`);

                // Convert WITHOUT resizing/cropping to square
                // We'll just resize width to max 600 or so to keep file size down, but keep aspect ratio.
                await sharp(filePath)
                    .resize({ width: 600, withoutEnlargement: true })
                    .webp({ quality: 85 })
                    .toFile(targetPath);

                // Delete the _orig file
                await fs.unlink(filePath);
            }
        }
    } catch (e) {
        console.error('Error:', e);
    }
    console.log('Done.');
}

optimizeRestored();
