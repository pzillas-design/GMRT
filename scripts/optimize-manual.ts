
import fs from 'fs/promises';
import path from 'path';

const requireSharp = () => require('sharp');

const TEAM_DIR = path.join(process.cwd(), 'public/uploads/team');
const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

async function optimizeManual() {
    console.log('Starting manual optimization...');
    const sharp = requireSharp();

    // 1. Optimize Team Images
    try {
        const teamFiles = await fs.readdir(TEAM_DIR);
        for (const file of teamFiles) {
            if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
                const filePath = path.join(TEAM_DIR, file);
                const ext = path.extname(file);
                const name = path.basename(file, ext);
                const newPath = path.join(TEAM_DIR, `${name}.webp`);

                console.log(`Converting Team Image: ${file} -> webp`);
                await sharp(filePath)
                    .resize(400, 400, { fit: 'cover' }) // Team images are small avatars
                    .webp({ quality: 80 })
                    .toFile(newPath);

                // Delete old
                await fs.unlink(filePath);
            }
        }
    } catch (e) {
        console.error('Error optimizing team images:', e);
    }

    // 2. Cleanup Bloat in Uploads
    try {
        const uploadFiles = await fs.readdir(UPLOADS_DIR);
        for (const file of uploadFiles) {
            if (file.includes('test-image') || file.includes('test-large')) {
                console.log(`Deleting bloat file: ${file}`);
                await fs.unlink(path.join(UPLOADS_DIR, file));
            }
        }
    } catch (e) {
        console.error('Error cleaning uploads:', e);
    }

    console.log('Manual optimization complete.');
}

optimizeManual();
