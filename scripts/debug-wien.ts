import axios from 'axios';
import * as cheerio from 'cheerio';

async function debugWien() {
    const url = 'https://gmrt.de/wien/';
    console.log(`Fetching ${url}...`);
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        $('a').each((i, element) => {
            const href = $(element).attr('href');
            const text = $(element).text().trim();
            if (href && (href.includes('rueckblick') || href.includes('wien'))) {
                console.log(`[${i}] Text: "${text}" Href: "${href}"`);
            }
        });

    } catch (error) {
        console.error(error);
    }
}

debugWien();
