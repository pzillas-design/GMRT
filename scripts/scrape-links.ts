import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const START_URLS = [
    'https://gmrt.de/chronik/',
    'https://gmrt.de/events/',
    'https://gmrt.de/berlin/',
    'https://gmrt.de/duesseldorf/',
    'https://gmrt.de/frankfurt/',
    'https://gmrt.de/hamburg/',
    'https://gmrt.de/koeln/',
    'https://gmrt.de/leipzig/',
    'https://gmrt.de/muenchen/',
    'https://gmrt.de/stuttgart/',
    'https://gmrt.de/hannover/',
    'https://gmrt.de/bremen/',
    'https://gmrt.de/ruhrgebiet/',
    'https://gmrt.de/wien/',
    'https://gmrt.de/zurich/',
    'https://gmrt.de/chronik/?e-filter-04384fe-category=wien',
    // Add other potential cities if known, or rely on discovery if we implemented spidering (but we keep it simple)
];
const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'legacy-links.json');

async function scrapeLinks() {
    const allLinks: Set<string> = new Set();
    const rootDomain = 'https://gmrt.de';

    for (const url of START_URLS) {
        console.log(`Fetching ${url}...`);
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            // Analysis of gmrt.de/chronik structure based on user request and common patterns:
            // Usually links are within some container. We'll look for all links that might be events.
            // Based on the "research" step, pages look like /city/title/

            // Strategy: Find all links in the main content area
            // The read_url_content showed a list of headers and "Weiterlesen..." links or direct headline links.
            // We will target links that contain "rueckblick" or "review" or are under city subdirectories.

            $('a').each((_, element) => {
                let href = $(element).attr('href');
                if (!href) return;

                // Resolve relative URLs
                if (href.startsWith('/')) {
                    href = rootDomain + href;
                } else if (!href.startsWith('http')) {
                    // Ignore hash links, mailto, etc.
                    return;
                }

                // Filter for relevant event links
                // exclude standard navigation and known static pages
                if (href.includes('gmrt.de/chronik')) return;
                if (href.includes('gmrt.de/events')) return;
                if (href.includes('gmrt.de/news')) return;
                if (href.includes('gmrt.de/kontakt')) return;
                if (href.includes('gmrt.de/ueber-uns')) return;
                if (href.includes('gmrt.de/impressum')) return;
                if (href.includes('gmrt.de/datenschutz')) return;
                if (href.includes('gmrt.de/en/')) return;
                if (href === 'https://gmrt.de/') return;
                if (START_URLS.includes(href)) return; // Don't add index pages as events

                // Check if it looks like an event (has a city name in path)
                // Improved regex to match typical structure: gmrt.de/cityname/post-slug/
                const isCityEvent = /gmrt\.de\/(berlin|duesseldorf|frankfurt|hamburg|koeln|leipzig|muenchen|stuttgart|hannover|bremen|ruhrgebiet|wien|zurich)\//i.test(href);

                if (isCityEvent) {
                    allLinks.add(href);
                } else {
                    // Log potentially missed interesting links for debugging (optional, can comment out)
                    // if (href.includes('gmrt.de') && href.length > 25) console.log('Skipped:', href);
                }
            });

        } catch (error) {
            console.error(`Error scraping ${url}:`, error instanceof Error ? error.message : String(error));
        }
    }

    const uniqueLinks = Array.from(allLinks);

    console.log(`Found ${uniqueLinks.length} unique event links.`);

    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(uniqueLinks, null, 2));
    console.log(`Saved links to ${OUTPUT_FILE}`);
}

scrapeLinks();
