import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Heading, Type, Image as ImageIcon, Video, FileText, Link as LinkIcon, Upload } from 'lucide-react';
import { ContentBlock } from '@/types';

interface EditorBlockProps {
    block: ContentBlock;
    index: number;
    isFirst: boolean;
    isLast: boolean;
    onUpdate: (id: string, updates: Partial<ContentBlock>) => void;
    onRemove: (id: string) => void;
    onMove: (index: number, direction: 'up' | 'down') => void;
    onFileUpload: (file: File, blockId: string) => void;
}

export const EditorBlock: React.FC<EditorBlockProps> = ({
    block,
    index,
    isFirst,
    isLast,
    onUpdate,
    onRemove,
    onMove,
    onFileUpload
}) => {
    return (
        <div className="group/block relative flex gap-2 hover:bg-slate-50 p-2 rounded-none transition-all border border-transparent hover:border-slate-200">
            {/* Arrow Navigation & Delete - Visible on Hover Only */}
            <div className="flex flex-col gap-2 pt-1 opacity-0 group-hover/block:opacity-100 transition-opacity absolute -left-16 top-0 h-full justify-center">
                <button
                    type="button"
                    onClick={() => onMove(index, 'up')}
                    disabled={isFirst}
                    title="Nach oben verschieben"
                    className="p-2 bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-gmrt-blue hover:border-gmrt-blue hover:bg-slate-50 disabled:opacity-0 transition-all rounded-none transform hover:scale-110 active:scale-95"
                >
                    <ArrowUp size={20} />
                </button>
                <button
                    type="button"
                    onClick={() => onMove(index, 'down')}
                    disabled={isLast}
                    title="Nach unten verschieben"
                    className="p-2 bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-gmrt-blue hover:border-gmrt-blue hover:bg-slate-50 disabled:opacity-0 transition-all rounded-none transform hover:scale-110 active:scale-95"
                >
                    <ArrowDown size={20} />
                </button>
                <button
                    type="button"
                    onClick={() => onRemove(block.id)}
                    title="Block löschen"
                    className="p-2 bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors mt-2 rounded-none transform hover:scale-110 active:scale-95"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="flex-grow w-full relative">
                {block.type === 'headline' && (
                    <input
                        type="text"
                        value={block.content}
                        onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                        className="w-full text-2xl font-bold px-0 py-1 bg-transparent border-none focus:ring-0 outline-none placeholder:text-slate-300 placeholder:font-normal text-slate-900"
                        placeholder="Überschrift..."
                    />
                )}
                {block.type === 'text' && (
                    <textarea
                        value={block.content}
                        onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                        className="w-full min-h-[50px] px-0 py-2 bg-transparent border-none focus:ring-0 outline-none resize-none text-slate-700 text-lg leading-relaxed placeholder:text-slate-300 placeholder:font-normal overflow-hidden"
                        placeholder="Schreiben Sie etwas..."
                        rows={1}
                        style={{ fieldSizing: "content" } as any}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                )}
                {(block.type === 'image' || block.type === 'video' || block.type === 'pdf') && (
                    <div className="space-y-4 py-2">

                        {/* Preview Area */}
                        {block.type === 'image' && block.content && (
                            <div className="relative w-full overflow-hidden border border-slate-100 shadow-sm group/image bg-white">
                                <img src={block.content} alt="Preview" className="w-full h-auto max-h-[500px] object-contain bg-slate-50" />
                                <label className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors cursor-pointer flex items-center justify-center">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0], block.id)}
                                    />
                                    <span className="opacity-0 group-hover/image:opacity-100 bg-white text-slate-900 border border-slate-200 font-bold px-4 py-2 shadow-sm text-sm rounded-none hover:bg-slate-50">Bild ändern</span>
                                </label>
                            </div>
                        )}

                        {block.type === 'video' && block.content && (
                            <div className="relative w-full overflow-hidden border border-slate-100 shadow-sm group/video bg-black">
                                <video src={block.content} controls className="w-full h-auto max-h-[500px]" />
                                <div className="absolute top-2 right-2 opacity-0 group-hover/video:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => onUpdate(block.id, { content: '' })}
                                        className="bg-white/90 text-slate-700 p-2 rounded-sm shadow-sm hover:bg-red-50 hover:text-red-600"
                                        title="Video entfernen"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Upload State (if empty) */}
                        {!block.content && (
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2">
                                    <label className="flex-grow cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 hover:border-gmrt-blue text-slate-500 hover:text-gmrt-blue h-32 transition-all flex flex-col items-center justify-center gap-2 text-sm font-medium rounded-none">
                                        <Upload size={24} />
                                        <span>
                                            {block.type === 'image' ? "Bild hochladen" : block.type === 'video' ? "Video hochladen" : "PDF hochladen"}
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept={block.type === 'image' ? "image/*" : block.type === 'video' ? "video/*" : "application/pdf"}
                                            onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0], block.id)}
                                        />
                                    </label>
                                </div>

                                {/* Video Link Option */}
                                {block.type === 'video' && (
                                    <div className="flex items-center gap-3">
                                        <div className="h-px bg-slate-200 flex-grow"></div>
                                        <span className="text-xs font-bold text-slate-400 uppercase">ODER LINK</span>
                                        <div className="h-px bg-slate-200 flex-grow"></div>
                                    </div>
                                )}
                                {block.type === 'video' && (
                                    <div className="flex gap-2">
                                        <div className="relative flex-grow">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                <LinkIcon size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="YouTube, Vimeo oder Video-URL einfügen..."
                                                className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50 focus:bg-white focus:border-gmrt-blue outline-none transition-colors text-sm"
                                                onBlur={(e) => {
                                                    if (e.target.value.trim()) {
                                                        onUpdate(block.id, { content: e.target.value.trim() });
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        if (e.currentTarget.value.trim()) {
                                                            onUpdate(block.id, { content: e.currentTarget.value.trim() });
                                                        }
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}


                        <input
                            type="text"
                            value={block.caption || ''}
                            onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
                            className="w-full bg-transparent border-b border-transparent focus:border-slate-300 outline-none text-xs text-center text-slate-500 placeholder:text-slate-300"
                            placeholder={block.type === 'pdf' ? "Titel des PDFs" : "Bildunterschrift"}
                        />
                    </div>
                )}
                {block.type === 'link' && (
                    <div className="space-y-2 p-2 bg-slate-50 border border-slate-100 rounded-none">
                        <div className="flex items-center gap-2">
                            <LinkIcon size={16} className="text-slate-400" />
                            <input
                                type="text"
                                value={block.caption || ''}
                                onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
                                className="font-bold text-gmrt-blue bg-transparent border-b border-transparent focus:border-gmrt-blue outline-none"
                                placeholder="Link Button Text"
                            />
                        </div>
                        <input
                            type="text"
                            value={block.content}
                            onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                            className="w-full px-3 py-1 text-xs font-mono text-slate-500 bg-transparent outline-none"
                            placeholder="https://..."
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
