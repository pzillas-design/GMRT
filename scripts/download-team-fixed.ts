import fs from 'fs';
import path from 'path';
import https from 'https';

const BASE_URL = 'https://gmrt.de/wp-content/uploads/2025/08/';
const OUTPUT_DIR = path.join(process.cwd(), 'public/uploads/team');

const IMAGE_MAP: Record<string, string> = {
    'andreas-stoffers': 'Andreas_Stoffers2.jpg',
    'hanns-robert-mayer': 'Bild-H.-R.jpg',
    'christian-wachtmeister': 'Christian-Wachtmeister-1.jpg',
    'christof-grabner': 'Grabner_Wien2-1.jpg',
    'roland-mauss': 'Hr_Mauss.jpg',
    'jai-shankar': 'Jai_Shankar.jpg',
    'michael-fisahn-reinhard': 'MichaelFisahnReinhard_1.jpg',
    'paramsothy': 'Potrait-Param-5.jpg',
    'ludwig-graf-westarp': 'MichaelFisahnReinhard_1-1.jpg'
};

async function downloadFile(filename: string, dest: string) {
    const url = BASE_URL + filename;
    console.log(`Downloading ${url} -> ${dest}`);
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

async function run() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    for (const [localName, remoteName] of Object.entries(IMAGE_MAP)) {
        // Save as _orig
        const ext = path.extname(remoteName);
        const dest = path.join(OUTPUT_DIR, `${localName}_orig${ext}`);
        try {
            await downloadFile(remoteName, dest);
        } catch (e) {
            console.error(e);
        }
    }
}

run();
