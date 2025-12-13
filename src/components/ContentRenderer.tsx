
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
                            <h2 key={block.id} className="text-2xl md:text-3xl font-bold text-gmrt-blue mt-8 mb-4 break-words overflow-hidden">
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
                            <div key={block.id} className="prose prose-lg text-slate-700 max-w-none leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                                {linkify(block.content)}
                            </div>
                        );
                    case 'image':
                        return (
                            <figure key={block.id} className="my-8 relative w-full rounded-2xl overflow-hidden shadow-sm bg-slate-50">
                                <Image
                                    src={block.content}
                                    alt={block.caption || 'Blog image'}
                                    width={1200}
                                    height={800}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
                                    className="w-full h-auto object-contain"
                                    priority={false}
                                />
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
                            <div key={block.id} className="my-8">
                                <a
                                    href={block.content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-gmrt-blue/50 hover:shadow-md transition-all group no-underline"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                        <FileText size={24} />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-bold text-slate-800 text-base group-hover:text-gmrt-blue transition-colors truncate pr-4">
                                            {block.caption || 'PDF Dokument ansehen'}
                                        </h3>
                                        <span className="text-sm text-slate-400 font-medium">
                                            PDF • Klicken zum Öffnen
                                        </span>
                                    </div>
                                    <div className="hidden sm:flex items-center justify-center w-8 h-8 text-slate-300 group-hover:translate-x-1 group-hover:text-gmrt-blue transition-all">
                                        <ExternalLink size={20} />
                                    </div>
                                </a>
                            </div>
                        );
                    case 'link':
                        return (
                            <div key={block.id} className="my-8">
                                <a
                                    href={block.content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-gmrt-blue/50 hover:shadow-md transition-all group no-underline"
                                >
                                    <div className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-500 rounded-lg group-hover:text-gmrt-blue group-hover:bg-blue-50 transition-colors duration-300">
                                        <LinkIcon size={24} />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-bold text-slate-800 text-base group-hover:text-gmrt-blue transition-colors truncate pr-4">
                                            {block.caption || 'Link öffnen'}
                                        </h3>
                                        <span className="text-sm text-slate-400 font-medium truncate block font-mono opacity-80">
                                            {block.content.replace(/^https?:\/\//, '')}
                                        </span>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold group-hover:bg-gmrt-blue group-hover:text-white transition-colors">
                                        Öffnen
                                    </div>
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
