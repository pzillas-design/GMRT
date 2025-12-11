
import React from 'react';
import { ContentBlock } from '@/types';
import { FileText, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ContentRendererProps {
    blocks: ContentBlock[];
}

export function ContentRenderer({ blocks }: ContentRendererProps) {
    if (!blocks || blocks.length === 0) return null;

    return (
        <div className="space-y-8">
            {blocks.map((block) => {
                switch (block.type) {
                    case 'headline':
                        // Simplified headline (always H2 style, but maybe H2 or H3 tag)
                        return (
                            <h2 key={block.id} className="text-2xl md:text-3xl font-bold text-gmrt-blue mt-8 mb-4">
                                {block.content}
                            </h2>
                        );
                    case 'text':
                        // Advanced linkify function
                        const linkify = (text: string) => {
                            // Matches http/https, www. links, OR email addresses
                            const urlRegex = /((?:https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
                            const parts = text.split(urlRegex);
                            return parts.map((part, i) => {
                                if (part.match(urlRegex)) {
                                    // Separate trailing punctuation (common in sentences ending with a link)
                                    const match = part.match(/^(.*?)([\.,;!\?)]+)?$/);
                                    if (match) {
                                        const content = match[1];
                                        const punctuation = match[2] || '';

                                        let href = content;
                                        const isEmail = content.includes('@') && !content.includes('://') && !content.startsWith('www.');

                                        if (isEmail) {
                                            href = `mailto:${content}`;
                                        } else if (content.startsWith('www.')) {
                                            href = `https://${content}`;
                                        }

                                        return (
                                            <React.Fragment key={i}>
                                                <a href={href} target={isEmail ? "" : "_blank"} rel="noopener noreferrer" className="text-gmrt-blue hover:underline break-all font-medium">
                                                    {content}
                                                </a>
                                                {punctuation}
                                            </React.Fragment>
                                        );
                                    }
                                }
                                return part;
                            });
                        };

                        return (
                            <div key={block.id} className="prose prose-lg text-slate-700 max-w-none leading-relaxed whitespace-pre-wrap">
                                {linkify(block.content)}
                            </div>
                        );
                    case 'image':
                        return (
                            <figure key={block.id} className="my-8 relative w-full rounded-2xl overflow-hidden shadow-sm">
                                <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                                    <Image
                                        src={block.content}
                                        alt={block.caption || 'Blog image'}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                                        className="object-cover"
                                        priority={false}
                                    />
                                </div>
                                {block.caption && (
                                    <figcaption className="text-center text-sm text-slate-500 mt-3 italic">
                                        {block.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    case 'video':
                        let videoSrc = block.content;
                        if (!videoSrc) return null;

                        // Simple Youtube/Vimeo embedding logic
                        if (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be')) {
                            const videoId = videoSrc.includes('v=') ? videoSrc.split('v=')[1].split('&')[0] : videoSrc.split('/').pop();
                            videoSrc = `https://www.youtube.com/embed/${videoId}`;
                        } else if (videoSrc.includes('vimeo.com')) {
                            const videoId = videoSrc.split('/').pop();
                            videoSrc = `https://player.vimeo.com/video/${videoId}`;
                        }

                        return (
                            <div key={block.id} className="my-8 aspect-video rounded-2xl overflow-hidden shadow-sm bg-slate-100">
                                {videoSrc.startsWith('http') && !videoSrc.match(/\.(mp4|webm|mov)$/) ? (
                                    <iframe
                                        src={videoSrc}
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        title="Video player"
                                    />
                                ) : (
                                    <video src={block.content} controls className="w-full h-full" playsInline />
                                )}
                            </div>
                        );
                    case 'pdf':
                        return (
                            <div key={block.id} className="my-6">
                                <a
                                    href={block.content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-gmrt-blue/30 hover:shadow-sm transition-all group"
                                >
                                    <div className="p-3 bg-white rounded-lg border border-slate-100 group-hover:border-gmrt-blue/20 text-gmrt-salmon">
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-slate-800 group-hover:text-gmrt-blue transition-colors">
                                            {block.caption || 'PDF Dokument herunterladen'}
                                        </h3>
                                        <p className="text-sm text-slate-500">Klicken zum Öffnen</p>
                                    </div>
                                    <ExternalLink size={20} className="text-slate-400 group-hover:text-gmrt-blue" />
                                </a>
                            </div>
                        );
                    case 'link':
                        return (
                            <div key={block.id} className="my-6">
                                <a
                                    href={block.content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gmrt-blue text-white rounded-full font-medium hover:bg-gmrt-logo transition-all shadow-sm hover:shadow-md"
                                >
                                    <LinkIcon size={18} />
                                    {block.caption || 'Link öffnen'}
                                </a>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </div >
    );
};
