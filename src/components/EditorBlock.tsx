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
    onFileUpload: (file: File, blockId: string) => Promise<void>;
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
    const [isUploading, setIsUploading] = React.useState(false);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        try {
            await onFileUpload(file, block.id);
        } catch (e) {
            console.error(e);
        } finally {
            setIsUploading(false);
        }
    };
    return (
        <div className="group/block relative p-6 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all duration-300 border border-transparent hover:shadow-sm">

            {/* Integrated Action Toolbar (Top Right) */}
            <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-all duration-200 z-20 bg-white p-1 rounded-lg border border-slate-200 shadow-md translate-y-2 group-hover/block:translate-y-0">
                <button
                    type="button"
                    onClick={() => onMove(index, 'up')}
                    disabled={isFirst}
                    title="Nach oben"
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-md disabled:opacity-30 transition-colors"
                >
                    <ArrowUp size={16} />
                </button>
                <button
                    type="button"
                    onClick={() => onMove(index, 'down')}
                    disabled={isLast}
                    title="Nach unten"
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-md disabled:opacity-30 transition-colors"
                >
                    <ArrowDown size={16} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                <button
                    type="button"
                    onClick={() => onRemove(block.id)}
                    title="Löschen"
                    className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-md transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="w-full relative">
                {block.type === 'headline' && (
                    <textarea
                        value={block.content}
                        onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                        className="w-full text-3xl font-extrabold px-0 py-2 bg-transparent border-none focus:ring-0 outline-none placeholder:text-slate-400 placeholder:font-bold text-slate-900 resize-none overflow-hidden"
                        placeholder="Überschrift..."
                        rows={1}
                        style={{ fieldSizing: "content" } as any}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                )}
                {block.type === 'text' && (
                    <textarea
                        value={block.content}
                        onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                        className="w-full min-h-[50px] px-0 py-2 bg-transparent border-none focus:ring-0 outline-none resize-none text-slate-600 text-lg leading-relaxed placeholder:text-slate-400 font-medium tracking-wide overflow-hidden"
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
                    <div className="space-y-4 pt-2 relative">


                        {/* Preview Area */}
                        {block.type === 'image' && block.content && (
                            <div className="relative w-full overflow-hidden rounded-lg bg-white shadow-sm border border-slate-100 group/image">
                                <img src={block.content} alt="Preview" className="w-full h-auto max-h-[600px] object-contain bg-slate-50/50" />
                                <label className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors cursor-pointer flex items-center justify-center">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                                    />
                                    <span className="opacity-0 group-hover/image:opacity-100 bg-white text-slate-900 font-bold px-6 py-3 rounded-lg shadow-lg transform scale-95 group-hover/image:scale-100 transition-all flex items-center gap-2">
                                        <Upload size={18} />
                                        Bild ändern
                                    </span>
                                </label>
                                {isUploading && (
                                    <div className="absolute inset-0 z-20 bg-white/80 flex flex-col items-center justify-center backdrop-blur-[2px]">
                                        <div className="w-8 h-8 border-2 border-gmrt-blue border-t-transparent rounded-full animate-spin mb-2"></div>
                                        <span className="text-xs font-bold text-gmrt-blue">Wird aktualisiert...</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {block.type === 'video' && block.content && (
                            <div className="relative w-full overflow-hidden rounded-lg bg-black shadow-sm border border-slate-200 group/video">
                                <video src={block.content} controls className="w-full h-auto max-h-[500px]" />
                                <div className="absolute top-4 right-4 opacity-0 group-hover/video:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => onUpdate(block.id, { content: '' })}
                                        className="bg-white/90 text-slate-700 p-2 rounded-lg shadow-md hover:bg-red-50 hover:text-red-600 border border-slate-200"
                                        title="Entfernen"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {block.type === 'pdf' && block.content && (
                            <div className="relative w-full bg-white p-4 flex items-center gap-5 rounded-lg border border-slate-200 shadow-sm group/pdf">
                                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                    <FileText size={32} className="text-red-500" />
                                </div>
                                <div className="flex-grow overflow-hidden">
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">Dokument</h4>
                                    <a href={block.content} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-gmrt-blue hover:underline truncate block text-sm font-mono">
                                        {block.content.split('/').pop() || 'Dokument.pdf'}
                                    </a>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onUpdate(block.id, { content: '' })}
                                    className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    title="PDF entfernen"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )}

                        {/* Upload State (Super Clean Design) */}
                        {!block.content && (
                            <div className="p-8 transition-all group/upload relative">
                                <div className="flex flex-col items-center justify-center gap-6 text-center">
                                    <label className="cursor-pointer flex flex-col items-center justify-center gap-4 group-hover/upload:scale-105 transition-transform duration-300">
                                        {isUploading ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 flex items-center justify-center mb-2">
                                                    <div className="w-6 h-6 border-2 border-slate-300 border-t-gmrt-blue rounded-full animate-spin"></div>
                                                </div>
                                                <span className="text-sm font-bold text-gmrt-blue">Wird hochgeladen...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center text-slate-400 group-hover/upload:text-gmrt-blue group-hover/upload:bg-white transition-colors shadow-sm">
                                                    {block.type === 'image' ? <ImageIcon size={32} strokeWidth={1.5} /> : block.type === 'video' ? <Video size={32} strokeWidth={1.5} /> : <FileText size={32} strokeWidth={1.5} />}
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="block font-bold text-slate-700 text-lg">
                                                        {block.type === 'image' ? "Bild auswählen" : block.type === 'video' ? "Video auswählen" : "PDF auswählen"}
                                                    </span>
                                                    <span className="block text-sm text-slate-400 font-medium">
                                                        Klicken oder hineinziehen
                                                    </span>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept={block.type === 'image' ? "image/*" : block.type === 'video' ? "video/*" : "application/pdf"}
                                                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                                                />
                                            </>
                                        )}
                                    </label>

                                    {/* Video Link Option */}
                                    {block.type === 'video' && !isUploading && (
                                        <div className="w-full max-w-sm">
                                            <div className="relative group/link">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/link:text-gmrt-blue transition-colors">
                                                    <LinkIcon size={16} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Oder YouTube / Vimeo Link"
                                                    className="w-full pl-10 pr-4 py-2 bg-white/50 border-none rounded-lg focus:bg-white focus:ring-2 focus:ring-gmrt-blue/10 outline-none transition-all text-sm font-medium text-slate-600 placeholder:text-slate-400 text-center shadow-sm"
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
                            </div>
                        )}

                        <div className="mt-3 w-full">
                            <input
                                type="text"
                                value={block.caption || ''}
                                onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
                                className="w-full bg-transparent border-b border-slate-200 focus:border-gmrt-blue outline-none text-sm text-left text-slate-700 font-medium placeholder:text-slate-400 transition-colors pb-2"
                                placeholder={block.type === 'pdf' ? "PDF Bezeichnung (optional)" : "Bildunterschrift hinzufügen (optional)..."}
                            />
                        </div>
                    </div>
                )}
                {block.type === 'link' && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold border-b border-slate-100 pb-2">
                            <LinkIcon size={18} />
                            <span>Link Button konfigurieren</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Button Text</label>
                                <input
                                    type="text"
                                    value={block.caption || ''}
                                    onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:bg-white focus:border-gmrt-blue outline-none transition-colors"
                                    placeholder="z.B. Jetzt anmelden"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Ziel-URL</label>
                                <input
                                    type="text"
                                    value={block.content}
                                    onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-600 focus:bg-white focus:border-gmrt-blue outline-none transition-colors"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
