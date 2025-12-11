import axios from 'axios';
import * as cheerio from 'cheerio';

async function debugContent() {
    const link = 'https://gmrt.de/wien/wien-rueckblick-004/';
    console.log(`Debug Scraping ${link}...`);

    try {
        const { data } = await axios.get(link, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        // 1. Title
        let title = $('h1.entry-title').text().trim();
        if (!title) title = $('h1').first().text().trim();
        if (!title) title = $('title').text().split('-')[0].trim();
        console.log('Title:', title);

        // 2. Date
        let date: string | null = null;
        const metaDate = $('.updated, .date, .post-date, .fusion-meta-info .date').first().text().trim();
        if (metaDate) {
            date = metaDate;
        } else {
            const fullText = $('body').text();
            const dateRegex = /(\d{1,2})\. (Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember) (\d{4})/i;
            const match = fullText.match(dateRegex);
            if (match) {
                date = match[0];
            } else {
                const shortDateMatch = fullText.match(/(\d{2})\.(\d{2})\.(\d{4})/);
                if (shortDateMatch) date = shortDateMatch[0];
            }
        }
        console.log('Date:', date);

        // 3. Location
        const cityMatch = link.match(/gmrt\.de\/([a-z]+)\//i);
        let location = 'Deutschland';
        if (cityMatch && cityMatch[1]) {
            location = cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1);
        }
        console.log('Location:', location);

        // 4. Content Blocks
        const article = $('article.post, .post, #content');
        let candidates;

        if (article.length > 0) {
            const elementorAvailable = article.find('.elementor-widget-theme-post-content, .elementor-widget-text-editor').length > 0;
            if (elementorAvailable) {
                candidates = article.find('.elementor-widget-theme-post-content p, .elementor-widget-theme-post-content h2, .elementor-widget-theme-post-content h3, .elementor-widget-theme-post-content img, .elementor-widget-text-editor p, .elementor-widget-text-editor h2, .elementor-widget-text-editor h3, .elementor-widget-text-editor img, .elementor-widget-theme-post-featured-image img, .elementor-widget-image img');
            } else {
                candidates = article.find('.entry-content p, .entry-content h2, .entry-content h3, .entry-content img, .post-content p, .post-content h2, .post-content img, .wp-post-image, .attachment-post-thumbnail');
            }
        }

        if (!candidates || candidates.length === 0) {
            candidates = $('.elementor-widget-container p, .elementor-widget-container h2, .elementor-widget-container img');
        }

        // Fallback for Wien legacy pages which might be very simple
        if (!candidates || candidates.length === 0) {
            console.log('Trying fallback selectors for simple pages...');
            candidates = $('p, h2, h3, img').filter((_, el) => {
                return $(el).closest('header, footer, nav, .sidebar').length === 0;
            });
        }

        console.log(`Found ${candidates ? candidates.length : 0} candidate elements.`);

        candidates.each((i, el) => {
            console.log(`Element [${i}]:`, $(el).prop('tagName'), $(el).text().substring(0, 50));
        });

    } catch (err) {
        console.error(`Failed to scrape ${link}:`, err);
    }
}

debugContent();
