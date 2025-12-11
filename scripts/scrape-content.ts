import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LINKS_FILE = path.join(DATA_DIR, 'legacy-links.json');
const CONTENT_FILE = path.join(DATA_DIR, 'legacy-content.json');

interface LegacyPost {
    url: string;
    title: string;
    date: string | null;
    location: string;
    blocks: any[]; // Using strict any for now to match our Block structure later
    imageUrls: string[]; // To be downloaded later
    coverImage?: string | null;
}

async function scrapeContent() {
    try {
        const fileContent = await fs.readFile(LINKS_FILE, 'utf-8');
        const links: string[] = JSON.parse(fileContent);

        console.log(`Found ${links.length} links to scrape.`);

        const posts: LegacyPost[] = [];

        // Process sequentially to be nice to the server (and debug easily)
        for (const [index, link] of links.entries()) {
            if (link.includes('__trashed') || link.includes('revision-v1')) {
                console.log(`[${index + 1}/${links.length}] Skipping trashed/revision link: ${link}`);
                continue;
            }

            console.log(`[${index + 1}/${links.length}] Scraping ${link}...`);

            try {
                const { data } = await axios.get(link, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                });
                const $ = cheerio.load(data);

                // 1. Title
                // Usually in an h1 tag, or class "entry-title"
                let title = $('h1.entry-title').text().trim();
                if (!title) title = $('h1').first().text().trim();
                if (!title) title = $('title').text().split('-')[0].trim();

                // 2. Date
                // Often in .date-container, .fusion-meta-info, or just text
                // We'll try to extract from text first if structured data isn't there
                // 2. Date extraction (Improved)
                let date: string | null = null;
                // Scope to article/post container to avoid picking up sidebar dates (e.g. upcoming events)
                const articleContainer = $('article.post, .post, #content, .entry-content').first();
                const dateContext = articleContainer.length ? articleContainer : $('body');

                const metaDate = dateContext.find('.updated, .date, .post-date, .fusion-meta-info .date, .entry-date').first().text().trim();

                if (metaDate) {
                    date = metaDate;
                } else {
                    // Search in full text for date patterns
                    const fullText = $('body').text();
                    const dateRegex = /(\d{1,2})\. (Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember) (\d{4})/i;
                    const match = fullText.match(dateRegex);
                    if (match) {
                        date = match[0];
                    } else {
                        // Try XX.XX.XXXX
                        const shortDateMatch = fullText.match(/(\d{2})\.(\d{2})\.(\d{4})/);
                        if (shortDateMatch) date = shortDateMatch[0];
                    }
                }

                // 3. Location (Same as before)
                const cityMatch = link.match(/gmrt\.de\/([a-z]+)\//i);
                let location = 'Deutschland';
                if (cityMatch && cityMatch[1]) {
                    location = cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1);
                    if (location === 'Duesseldorf') location = 'Düsseldorf';
                    if (location === 'Koeln') location = 'Köln';
                    if (location === 'Muenchen') location = 'München';
                    if (location === 'Zurich') location = 'Zürich';
                    // Wien, Hannover, Bremen, Ruhrgebiet work fine as-is with title case
                }

                // 4. Content Blocks (Robust Elementor Handling)
                // Select the main article wrapper to be sure we are inside the post
                const article = $('article.post, .post, #content');
                let candidates;

                const blocks: any[] = [];
                const imageUrls: string[] = [];

                if (article.length > 0) {
                    // Check for Elementor content widgets specifically
                    const elementorAvailable = article.find('.elementor-widget-theme-post-content, .elementor-widget-text-editor').length > 0;

                    if (elementorAvailable) {
                        candidates = article.find('.elementor-widget-theme-post-content p, .elementor-widget-theme-post-content h2, .elementor-widget-theme-post-content h3, .elementor-widget-theme-post-content img, .elementor-widget-text-editor p, .elementor-widget-text-editor h2, .elementor-widget-text-editor h3, .elementor-widget-text-editor img, .elementor-widget-theme-post-featured-image img, .elementor-widget-image img');
                    } else {
                        // Fallback for standard WP
                        candidates = article.find('.entry-content p, .entry-content h2, .entry-content h3, .entry-content img, .post-content p, .post-content h2, .post-content img, .wp-post-image, .attachment-post-thumbnail');
                    }
                }

                // If still nothing, just grab from body but stricter
                if (!candidates || candidates.length === 0) {
                    candidates = $('.elementor-widget-container p, .elementor-widget-container h2, .elementor-widget-container img');
                }

                console.log(`  > Found ${candidates.length} candidate elements.`);

                const cleanString = (str: string) => {
                    if (!str) return '';
                    // Remove messy quotes, trailing backslashes, and trim
                    return str.replace(/^"|"$/g, '').replace(/\\"/g, '"').replace(/\\+$/, '').trim();
                };

                candidates.each((_, el) => {
                    const $el = $(el);
                    const tag = $el.prop('tagName')?.toLowerCase() || '';
                    const text = cleanString($el.text());

                    // Skip garbage and navigation/related elements
                    if ($el.closest('.sharedaddy, .jp-relatedposts, .comments-area, footer, .elementor-post__thumbnail, .elementor-widget-posts, .related-posts, .post-navigation').length > 0) return;
                    if ($el.hasClass('elementor-post__thumbnail') || $el.hasClass('post-navigation')) return;

                    // Skip blocks that look like navigation: "Previous Post", "Next Post"
                    if (text.length < 50 && (text.includes('Next Post') || text.includes('Previous Post') || text.includes('Vorheriger Beitrag') || text.includes('Nächster Beitrag'))) return;

                    if (tag === 'img') {
                        let src = $el.attr('src') || $el.attr('data-src');
                        if (src && !src.includes('base64')) {
                            src = cleanString(src).replace(/"/g, ''); // Ensure no quotes in URL
                            if (src.startsWith('//')) src = 'https:' + src;

                            // Filter out small icons/gravatars
                            if (src.includes('gravatar') || src.includes('1x1') || src.includes('pixel')) return;

                            if (!imageUrls.includes(src)) {
                                imageUrls.push(src);
                                blocks.push({ type: 'image', content: src, caption: cleanString($el.attr('alt') || '') });
                            }
                        }
                    } else if (tag.startsWith('h')) {
                        if (text.length > 2) blocks.push({ type: 'headline', content: text });
                    } else if (tag === 'p') {
                        // Ensure it's not just a wrapper for an already-processed image
                        if ($el.children('img').length > 0 && text.length < 5) return;

                        // Ignore extremely short "text" blocks that are likely spacers
                        if (text.length < 2) return;

                        // Filter out footer signatures common in these posts
                        if (text.includes('Mit freundlichen Grüßen') || text.includes('Best regards')) {
                            // Trim content up to the signature or just skip if it's the whole block?
                            // Often signatures are their own block. Skip.
                            return;
                        }

                        if (text.length > 2) {
                            blocks.push({ type: 'text', content: text });
                        }
                    }
                });

                // Post-process blocks to merge adjacent text
                const mergedBlocks: any[] = [];
                let currentTextBlock = '';

                blocks.forEach(block => {
                    if (block.type === 'text') {
                        if (currentTextBlock) currentTextBlock += '\n\n';
                        currentTextBlock += block.content;
                    } else {
                        if (currentTextBlock) {
                            mergedBlocks.push({ type: 'text', content: currentTextBlock });
                            currentTextBlock = '';
                        }
                        mergedBlocks.push(block);
                    }
                });
                if (currentTextBlock) {
                    mergedBlocks.push({ type: 'text', content: currentTextBlock });
                }

                console.log(`  > Extracted ${mergedBlocks.length} blocks (merged from ${blocks.length}), ${imageUrls.length} images.`);

                // Determin Cover Image
                // Priority: generic 'wp-post-image' or 'elementor-widget-theme-post-featured-image' if captured in blocks? 
                // We captured images in blocks. scanning for "Featured" class in parent is hard now.
                // Simple heuristic: First image is cover. 
                // Better: Check if we found a Featured Image during scrape?

                // Let's assume the first image found is the best candidate for cover
                let coverImage = imageUrls.length > 0 ? imageUrls[0] : null;

                // Attempt to find a specific featured image in the candidates if possible, 
                // but since we already iterated, let's stick to the first one for now as a good default.

                // Check if title already exists to avoid duplicates
                const isDuplicate = posts.some(p => p.title === title);
                if (isDuplicate) {
                    console.log(`  > Skipping duplicate post: ${title}`);
                    continue;
                }

                posts.push({
                    url: link,
                    title,
                    date,
                    location,
                    blocks: mergedBlocks,
                    imageUrls,
                    coverImage
                });

            } catch (err) {
                console.error(`Failed to scrape ${link}:`, err);
            }

            // tiny delay
            await new Promise(r => setTimeout(r, 200));
        }

        await fs.writeFile(CONTENT_FILE, JSON.stringify(posts, null, 2));
        console.log(`Saved ${posts.length} posts to ${CONTENT_FILE}`);

    } catch (error) {
        console.error('Error in content extraction:', error);
    }
}

scrapeContent();
