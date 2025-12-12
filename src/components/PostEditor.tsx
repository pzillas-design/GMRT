'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Type, Video, FileText, Link as LinkIcon, Heading, Trash2, Wand2 } from 'lucide-react';
import { ContentBlock, ContentBlockType } from '@/types';
import { EditorBlock } from './EditorBlock';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ConfirmationModal } from '@/components/ui/Modal';
import { AnimatePresence, motion } from 'framer-motion';

interface PostEditorProps {
    initialData?: {
        title: string;
        location: string;
        eventDate: string;
        contentBlocks: ContentBlock[];
        coverImage?: string | null;
    };
    isEditing?: boolean;
    postId?: string;
    lang?: string;
}

export function PostEditor({ initialData, isEditing = false, postId, lang = 'de' }: PostEditorProps) {
    const router = useRouter();
    const { success, error: toastError } = useToast();

    // -- State --
    const [title, setTitle] = useState(initialData?.title || '');
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
    const [location, setLocation] = useState(initialData?.location || 'Allgemein');

    const [customLocation, setCustomLocation] = useState('');
    const [isCustomLocation, setIsCustomLocation] = useState(false);

    // Parse date or use current
    const initialDate = initialData?.eventDate ? new Date(initialData.eventDate) : new Date();
    const [day, setDay] = useState(initialData?.eventDate ? initialDate.getDate().toString() : '');
    const [month, setMonth] = useState(initialData?.eventDate ? (initialDate.getMonth() + 1).toString() : '');
    const [year, setYear] = useState(initialData?.eventDate ? initialDate.getFullYear().toString() : '');

    const [blocks, setBlocks] = useState<ContentBlock[]>(initialData?.contentBlocks || []);
    const [isSaving, setIsSaving] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null);

    const locations = ['Allgemein', 'Düsseldorf', 'Frankfurt', 'München', 'Berlin', 'Hamburg', 'Stuttgart', 'Wien', 'Zürich', 'Hannover', 'Bremen', 'Ruhrgebiet'];

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // -- Effects --
    useEffect(() => {
        if (initialData?.location && !locations.includes(initialData.location)) {
            setIsCustomLocation(true);
            setCustomLocation(initialData.location);
            setLocation('custom_new_entry');
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // -- Helpers & Handlers --

    const locationImages: Record<string, string> = {
        'Düsseldorf': '/images/duesseldorf.png',
        'Frankfurt': '/images/frankfurt.png',
        'München': '/images/muenchen.png',
        'Wien': '/images/wien.png',
        'Zürich': '/images/zurich.png',
        'Hannover': '/images/hannover.png',
        'Bremen': '/images/bremen.png',
        'Ruhrgebiet': '/images/ruhrgebiet.png',
        'Berlin': '/images/berlin.png',
        // Fallbacks
        'Hamburg': '/images/default-blog.png',
        'Stuttgart': '/images/default-blog.png',
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setLocation(value);
        if (value === 'Neu...') {
            setIsCustomLocation(true);
        } else {
            setIsCustomLocation(false);
            setCustomLocation('');
            // Set default image logic
            const newDefault = locationImages[value];
            const isCurrentDefault = !coverImage || Object.values(locationImages).includes(coverImage);
            if (newDefault && isCurrentDefault) {
                setCoverImage(newDefault);
            }
        }
    };

    const addBlock = (type: ContentBlockType, index?: number) => {
        const newBlock: ContentBlock = {
            id: crypto.randomUUID(),
            type,
            content: '',
        };

        if (typeof index === 'number') {
            const newBlocks = [...blocks];
            const insertIdx = index === -1 ? 0 : index + 1;
            newBlocks.splice(insertIdx, 0, newBlock);
            setBlocks(newBlocks);
        } else {
            setBlocks([...blocks, newBlock]);
            // Scroll to bottom
            setTimeout(() => {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    };

    const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[targetIndex];
        newBlocks[targetIndex] = temp;
        setBlocks(newBlocks);
    };

    const handleFileUpload = async (file: File): Promise<string> => {
        console.log('Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Upload failed with status:', res.status, 'Response:', errorText);
                throw new Error('Upload failed: ' + errorText);
            }

            const data = await res.json();
            console.log('Upload successful, URL:', data.url);
            return data.url;
        } catch (error) {
            console.error('Upload error in catch block:', error);
            throw error;
        }
    };

    const handleBlockFileUpload = async (file: File, blockId: string) => {
        try {
            const url = await handleFileUpload(file);
            updateBlock(blockId, { content: url });
        } catch (error: any) {
            console.error('Block upload error:', error);
            toastError(error.message || "Upload failed");
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            success(lang === 'de' ? 'Beitrag gelöscht' : 'Post deleted');
            router.push(`/${lang}`);
            router.refresh();
        } catch (error) {
            console.error('Error deleting post:', error);
            toastError(lang === 'de' ? 'Fehler beim Löschen des Beitrags.' : 'Error deleting post.');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        if (!title.trim()) {
            toastError(lang === 'de' ? 'Bitte geben Sie einen Titel ein.' : 'Please enter a title.');
            setIsSaving(false);
            return;
        }

        try {
            const finalLocation = isCustomLocation ? customLocation : location;
            const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            const eventDate = new Date(dateStr);

            if (isNaN(eventDate.getTime())) {
                toastError(lang === 'de' ? 'Bitte geben Sie ein gültiges Datum ein.' : 'Please enter a valid date.');
                setIsSaving(false);
                return;
            }

            const payload = {
                title,
                coverImage,
                location: finalLocation,
                eventDate: eventDate.toISOString(),
                contentBlocks: JSON.stringify(blocks),
                content: blocks.map(b => b.content).join('\n')
            };

            const url = isEditing && postId ? `/api/posts/${postId}` : '/api/posts';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to save post');

            const savedPost = await response.json();

            success(lang === 'de' ? 'Beitrag gespeichert' : 'Post saved');

            if (isEditing) {
                router.push(`/${lang}/posts/${postId}`);
            } else {
                router.push(`/${lang}/posts/${savedPost.id}`);
            }
            router.refresh();
        } catch (error) {
            console.error('Error saving post:', error);
            toastError(lang === 'de' ? 'Fehler beim Speichern des Beitrags.' : 'Error saving post.');
        } finally {
            setIsSaving(false);
        }
    };

    // Dictionary
    const t = {
        de: {
            insert: 'Einfügen',
            text: 'Text',
            image: 'Bild',
            video: 'Video',
            pdf: 'PDF',
            link: 'Link',
            headline: 'Überschrift',
            back: 'Zurück',
            publish: 'Veröffentlichen',
            saving: 'Speichert...',
            title: 'Titel',
            coverImage: 'Titelbild hinzufügen',
            location: 'Kategorie',
            delete: 'Löschen',
        },
        en: {
            insert: 'Insert',
            text: 'Text',
            image: 'Image',
            video: 'Video',
            pdf: 'PDF',
            link: 'Link',
            headline: 'Heading',
            back: 'Back',
            publish: 'Publish',
            saving: 'Saving...',
            title: 'Title',
            coverImage: 'Add Cover Image',
            location: 'Category',
            delete: 'Delete',
        }
    }[lang as 'de' | 'en'] || {
        insert: 'Insert',
        text: 'Text',
        image: 'Image',
        video: 'Video',
        pdf: 'PDF',
        link: 'Link',
        headline: 'Heading',
        back: 'Back',
        publish: 'Publish',
        saving: 'Saving...',
        title: 'Title',
        coverImage: 'Add Cover Image',
        location: 'Category',
        delete: 'Delete',
    };

    return (
        <div className="min-h-screen bg-[#F9F9F7] text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-900">
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title={lang === 'de' ? 'Beitrag löschen?' : 'Delete Post?'}
                message={lang === 'de' ? 'Sind Sie sicher, dass Sie diesen Beitrag löschen möchten?' : 'Are you sure you want to delete this post?'}
                confirmText={lang === 'de' ? 'Löschen' : 'Delete'}
                cancelText={lang === 'de' ? 'Abbrechen' : 'Cancel'}
                isDanger
                isLoading={isDeleting}
            />

            {/* Top Bar - Minimal */}
            <div className="sticky top-0 z-50 bg-[#F9F9F7]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between transition-all">
                <Button variant="ghost" onClick={() => router.back()} icon={<ArrowLeft size={20} className="text-slate-400 hover:text-slate-800 transition-colors" />}>
                    <span className="sr-only">{t.back}</span>
                </Button>
                <div className="flex gap-3">
                    {isEditing && postId && (
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(true)} disabled={isSaving} className="text-slate-400 hover:text-red-600 hover:bg-red-50/50 px-3">
                            <Trash2 size={20} />
                        </Button>
                    )}
                    <button
                        onClick={handleSubmit as any}
                        disabled={isSaving}
                        className="bg-slate-900 text-[#F9F9F7] px-6 py-2 rounded-full font-medium text-sm hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg shadow-slate-200"
                    >
                        {isSaving ? t.saving : t.publish}
                    </button>
                </div>
            </div>

            <div className="max-w-[720px] mx-auto px-6 py-12 pb-32">
                <form onSubmit={handleSubmit} className="relative space-y-12">

                    {/* Metadata Header Group */}
                    <div className="space-y-6">
                        {/* Cover Image - Floating Card */}
                        <div className="group relative w-full rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5 aspect-[21/9] transition-all hover:shadow-md">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleFileUpload(file)
                                            .then(url => setCoverImage(url))
                                            .catch((err) => {
                                                console.error(err);
                                                toastError(err.message || (lang === 'de' ? 'Bild-Upload fehlgeschlagen' : 'Image upload failed'));
                                            });
                                    }
                                }}
                            />

                            {coverImage ? (
                                <>
                                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-white/90 backdrop-blur text-slate-800 px-5 py-2.5 rounded-full font-medium text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            <Wand2 size={16} />
                                            {lang === 'de' ? 'Bild ändern' : 'Change Image'}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCoverImage('')}
                                        className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 text-slate-400"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors"
                                >
                                    <ImageIcon size={32} strokeWidth={1.5} />
                                    <span className="font-medium text-sm">{t.coverImage}</span>
                                </button>
                            )}
                        </div>

                        {/* Title - Serif & Big */}
                        <textarea
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            className="w-full text-5xl md:text-6xl font-serif font-medium text-slate-900 placeholder:text-slate-300 bg-transparent border-none focus:ring-0 outline-none resize-none overflow-hidden leading-tight"
                            placeholder={lang === 'de' ? 'Titel...' : 'Title...'}
                            rows={1}
                            style={{ minHeight: '1.2em' }}
                        />

                        {/* Byline / Metadata Row */}
                        <div className="flex flex-wrap items-center gap-3 text-slate-400 text-base font-normal border-b border-slate-200/60 pb-8">
                            <span>{lang === 'de' ? 'Veröffentlicht am' : 'Published on'}</span>

                            {/* Date Inputs - Invisible */}
                            <div className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                                <input type="number" value={day} onChange={(e) => setDay(e.target.value)} placeholder="DD" className="w-8 bg-transparent text-center outline-none focus:text-slate-900 border-b border-transparent focus:border-slate-300 placeholder:text-slate-300" />
                                <span>.</span>
                                <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="MM" className="w-8 bg-transparent text-center outline-none focus:text-slate-900 border-b border-transparent focus:border-slate-300 placeholder:text-slate-300" />
                                <span>.</span>
                                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="YYYY" className="w-12 bg-transparent text-center outline-none focus:text-slate-900 border-b border-transparent focus:border-slate-300 placeholder:text-slate-300" />
                            </div>

                            <span>{lang === 'de' ? 'in' : 'in'}</span>

                            {/* Category - Invisible Select */}
                            <div className="relative group/cat">
                                {isCustomLocation ? (
                                    <div className="relative inline-block">
                                        <input
                                            type="text"
                                            value={customLocation}
                                            onChange={(e) => setCustomLocation(e.target.value)}
                                            className="bg-transparent border-b border-slate-300 focus:border-slate-800 outline-none w-32 text-slate-900 placeholder:text-slate-300"
                                            placeholder={lang === 'de' ? "Kategorie..." : "Category..."}
                                            autoFocus
                                        />
                                        <button onClick={() => setIsCustomLocation(false)} className="ml-2 text-slate-400 hover:text-slate-600">&times;</button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <select
                                            value={location}
                                            onChange={(e) => {
                                                if (e.target.value === 'custom_new_entry') setIsCustomLocation(true);
                                                else setLocation(e.target.value);
                                            }}
                                            className="appearance-none bg-transparent pr-4 cursor-pointer hover:text-slate-600 outline-none focus:text-slate-900"
                                        >
                                            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                            <option value="custom_new_entry">+ {lang === 'de' ? 'Neu...' : 'New...'}</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Area - Pure & Clean */}
                    <div id="content-blocks-container" className="pt-4 relative min-h-[30vh]">

                        {/* Blocks */}
                        <div className="space-y-4">
                            {blocks.length > 0 && (
                                <div className="h-4 group/top-insert relative z-30 flex justify-center items-center hover:h-16 transition-all duration-200 -mb-4">
                                    <div className="absolute top-1/2 left-4 right-4 h-px bg-gmrt-blue/10 opacity-0 group-hover/top-insert:opacity-100 transition-opacity pointer-events-none"></div>
                                    <div className="flex items-center gap-1 bg-white border border-slate-200 shadow-md p-1 px-4 rounded-none scale-0 opacity-0 group-hover/top-insert:scale-100 group-hover/top-insert:opacity-100 transition-all duration-200 relative z-30">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 select-none border-r border-slate-200 pr-2">{t.insert}</span>
                                        <button type="button" onClick={() => addBlock('text', -1)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><Type size={14} /></button>
                                        <button type="button" onClick={() => addBlock('headline', -1)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><Heading size={14} /></button>
                                        <button type="button" onClick={() => addBlock('image', -1)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><ImageIcon size={14} /></button>
                                        <button type="button" onClick={() => addBlock('video', -1)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><Video size={14} /></button>
                                        <button type="button" onClick={() => addBlock('pdf', -1)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><FileText size={14} /></button>
                                        <button type="button" onClick={() => addBlock('link', -1)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><LinkIcon size={14} /></button>
                                    </div>
                                </div>
                            )}

                            <AnimatePresence mode='popLayout'>
                                {blocks.map((block, index) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        key={block.id}
                                        className="relative group/wrapper"
                                        onMouseEnter={() => setHoveredBlockIndex(index)}
                                        onMouseLeave={() => setHoveredBlockIndex(null)}
                                    >
                                        <div className="py-6">
                                            <EditorBlock
                                                block={block}
                                                index={index}
                                                isFirst={index === 0}
                                                isLast={index === blocks.length - 1}
                                                onUpdate={updateBlock}
                                                onRemove={removeBlock}
                                                onMove={moveBlock}
                                                onFileUpload={handleBlockFileUpload}
                                            />
                                        </div>

                                        {/* Hover Insertion (Between) */}
                                        <div className={`absolute -bottom-8 left-0 right-0 z-20 h-16 flex justify-center items-center opacity-0 group-hover/wrapper:opacity-100 hover:opacity-100 transition-opacity`}>
                                            <div className="absolute top-1/2 left-4 right-4 h-px bg-gmrt-blue/10 pointer-events-none"></div>
                                            <div className="flex items-center gap-1 bg-white border border-slate-200 shadow-md p-1 px-4 rounded-none scale-95 hover:scale-100 transition-transform relative z-30">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 select-none border-r border-slate-200 pr-2">{t.insert}</span>
                                                <button type="button" onClick={() => addBlock('text', index)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><Type size={14} /></button>
                                                <button type="button" onClick={() => addBlock('headline', index)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><Heading size={14} /></button>
                                                <button type="button" onClick={() => addBlock('image', index)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><ImageIcon size={14} /></button>
                                                <button type="button" onClick={() => addBlock('video', index)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><Video size={14} /></button>
                                                <button type="button" onClick={() => addBlock('pdf', index)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><FileText size={14} /></button>
                                                <button type="button" onClick={() => addBlock('link', index)} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue"><LinkIcon size={14} /></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Floating Toolbar (Zen Mode) */}
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md text-slate-200 p-1.5 rounded-full shadow-2xl ring-1 ring-white/10">
                            <span className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase select-none">{t.insert}</span>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>

                            <button type="button" onClick={() => addBlock('text')} className="p-2.5 rounded-full hover:bg-white/10 hover:text-white hover:scale-110 transition-all" title={t.text}>
                                <Type size={20} />
                            </button>
                            <button type="button" onClick={() => addBlock('headline')} className="p-2.5 rounded-full hover:bg-white/10 hover:text-white hover:scale-110 transition-all" title={t.headline}>
                                <Heading size={20} />
                            </button>
                            <button type="button" onClick={() => addBlock('image')} className="p-2.5 rounded-full hover:bg-white/10 hover:text-white hover:scale-110 transition-all" title={t.image}>
                                <ImageIcon size={20} />
                            </button>
                            <button type="button" onClick={() => addBlock('video')} className="p-2.5 rounded-full hover:bg-white/10 hover:text-white hover:scale-110 transition-all" title={t.video}>
                                <Video size={20} />
                            </button>
                            <button type="button" onClick={() => addBlock('pdf')} className="p-2.5 rounded-full hover:bg-white/10 hover:text-white hover:scale-110 transition-all" title={t.pdf}>
                                <FileText size={20} />
                            </button>
                            <button type="button" onClick={() => addBlock('link')} className="p-2.5 rounded-full hover:bg-white/10 hover:text-white hover:scale-110 transition-all" title={t.link}>
                                <LinkIcon size={20} />
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
