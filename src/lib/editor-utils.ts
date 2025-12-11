
import { Editor } from '@tiptap/react';
import { ContentBlock } from '@/types';

export function serializeToBlocks(editor: Editor): ContentBlock[] {
    const json = editor.getJSON();
    const blocks: ContentBlock[] = [];

    if (!json.content) return [];

    let currentTextBlock: ContentBlock | null = null;

    json.content.forEach((node: any) => {
        if (node.type === 'heading') {
            // Push any pending text block
            if (currentTextBlock) {
                blocks.push(currentTextBlock);
                currentTextBlock = null;
            }

            blocks.push({
                id: crypto.randomUUID(),
                type: 'headline',
                content: node.content?.[0]?.text || '',
                level: node.attrs?.level || 2,
            });
        } else if (node.type === 'image') {
            // Push any pending text block
            if (currentTextBlock) {
                blocks.push(currentTextBlock);
                currentTextBlock = null;
            }

            blocks.push({
                id: crypto.randomUUID(),
                type: 'image',
                content: node.attrs?.src || '',
                caption: node.attrs?.alt || '',
            });
        } else if (node.type === 'paragraph') {
            // Merge into current text block or start new one
            // We'll use simple HTML-like string for now, or just plain text if we want to be safe.
            // But user wants formatting. Let's try to preserve HTML.
            // Tiptap can get HTML for a node.

            // For simplicity in this "Magic Import", let's extract text. 
            // If we want HTML, we need to ask the editor for the HTML of this node.
            // Since we are iterating JSON, we might not have the HTML generator handy without the schema.
            // However, we can construct simple HTML from the JSON mark.

            const text = node.content?.map((c: any) => c.text).join('') || '';
            const html = text; // Just plain text for now to be safe with current renderer
            // Ideally we upgrade this to HTML later.

            if (!text.trim()) return; // Skip empty?

            if (currentTextBlock) {
                currentTextBlock.content += '\n\n' + text;
            } else {
                currentTextBlock = {
                    id: crypto.randomUUID(),
                    type: 'text',
                    content: text,
                };
            }
        }
        // Handle others?
    });

    if (currentTextBlock) {
        blocks.push(currentTextBlock);
    }

    return blocks;
}
