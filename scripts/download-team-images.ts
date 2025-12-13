import fs from 'fs';
import path from 'path';
import https from 'https';

const TARGET_URL = 'https://gmrt.de/ueber-uns/';
const OUTPUT_DIR = path.join(process.cwd(), 'public/uploads/team');

// Map of names to expected filenames (to keep our system working)
// I'll try to match them by partial src or just download all and manually rename if needed.
// Actually, looking at the previous file list:
// jai-shankar.webp
// paramsothy.webp
// roland-mauss.webp
// hanns-robert-mayer.webp
// michael-fisahn-reinhard.webp
// ludwig-graf-westarp.webp

const IMAGE_MAP: Record<string, string> = {
    'shankar': 'jai-shankar',
    'paramsothy': 'paramsothy',
    'mauss': 'roland-mauss',
    'mayer': 'hanns-robert-mayer',
    'reinhard': 'michael-fisahn-reinhard',
    'westarp': 'ludwig-graf-westarp'
};

async function downloadFile(url: string, dest: string) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            reject(err);
        });
    });
}

async function scrapeAndDownload() {
    console.log('Fetching page content...');
    // We'll just use a simple regex since I can't use a full browser/dom parser easily here and curl is messy.
    // Actually, I can use `fetch`.

    try {
        const res = await fetch(TARGET_URL);
        const html = await res.text();

        // Ensure dir exists
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }

        // Find images. Look for <img src="..." ...> inside the team section?
        // Let's just find all images and filter by likely candidates.
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        const matches = [];
        while ((match = imgRegex.exec(html)) !== null) {
            matches.push(match[1]);
        }

        console.log(`Found ${matches.length} image references.`);

        let count = 0;
        for (const src of matches) {
            // The images on the site likely contain the name.
            const lowerSrc = src.toLowerCase();
            let matchedName = null;

            for (const [key, filename] of Object.entries(IMAGE_MAP)) {
                if (lowerSrc.includes(key)) {
                    matchedName = filename;
                    break;
                }
            }

            if (matchedName) {
                // Construct full URL if relative
                let fullUrl = src;
                if (src.startsWith('/')) {
                    fullUrl = `https://gmrt.de${src}`;
                } else if (!src.startsWith('http')) {
                    fullUrl = `https://gmrt.de/${src}`;
                }

                // Get extension
                // The site currently uses JPG or PNG probably.
                // We'll save as original extension first.
                // Actually the user said "optimier die auf webp".
                // We'll download original first.
                const ext = path.extname(fullUrl.split('?')[0]) || '.jpg';
                const dest = path.join(OUTPUT_DIR, `${matchedName}_orig${ext}`);

                console.log(`Downloading ${matchedName} from ${fullUrl}...`);
                await downloadFile(fullUrl, dest);
                count++;
            }
        }
        console.log(`Downloaded ${count} team images.`);

    } catch (e) {
        console.error('Error:', e);
    }
}

scrapeAndDownload();
