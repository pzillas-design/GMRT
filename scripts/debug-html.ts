
import axios from 'axios';
import * as cheerio from 'cheerio';

const URL = 'https://gmrt.de/berlin/berlin-rueckblick-001/';

async function debug() {
    try {
        console.log(`Fetching ${URL}...`);
        const { data } = await axios.get(URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        // Dump first 1000 chars of body text to see what we got
        const bodyText = $('body').text();
        console.log("Body text preview:", bodyText.substring(0, 1000));
        console.log("Total length:", bodyText.length);

        // Find ALL images in the body and print them
        const allImages = $('img');
        console.log(`Total images in body: ${allImages.length}`);

        allImages.each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
            const parentClass = $(el).parent().attr('class') || 'no-class';
            const grandParentClass = $(el).parent().parent().attr('class') || 'no-class';

            if (src && (src.includes('.jpg') || src.includes('.png'))) {
                console.log(`[Img ${i}] Src: ${src}`);
                console.log(`       Parent: ${parentClass}`);
                console.log(`       Grandparent: ${grandParentClass}`);
            }
        });



    } catch (e) {
        console.error(e);
    }
}

debug();
