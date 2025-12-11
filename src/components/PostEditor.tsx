'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heading, Type, Image as ImageIcon, Video, FileText, Link as LinkIcon, Upload, Wand2, Trash2 } from 'lucide-react';
import { ContentBlock, ContentBlockType } from '@/types';
import { EditorBlock } from './EditorBlock';
import { Button } from '@/components/ui/Button';


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

    const locations = ['Allgemein', 'Düsseldorf', 'Frankfurt', 'München', 'Berlin', 'Hamburg', 'Stuttgart', 'Wien', 'Zürich', 'Hannover', 'Bremen', 'Ruhrgebiet', 'Neu...'];

    // Initialize state properly based on initialData
    useEffect(() => {
        if (initialData?.location && !locations.includes(initialData.location)) {
            setIsCustomLocation(true);
            setCustomLocation(initialData.location);
            setLocation('Neu...');
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null);

    // Default Images for Locations
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
            // Set default image if cover is empty or is one of the KEY default images (allowing correction)
            const newDefault = locationImages[value];

            // Check if current cover is ANY of our known defaults
            const isCurrentDefault = !coverImage || Object.values(locationImages).includes(coverImage);

            if (newDefault && isCurrentDefault) {
                setCoverImage(newDefault);
            }
        }
    };

    // Add block at specific index
    const addBlock = (type: ContentBlockType, index?: number) => {
        const newBlock: ContentBlock = {
            id: crypto.randomUUID(),
            type,
            content: '',
        };

        if (typeof index === 'number') {
            const newBlocks = [...blocks];
            // If index is -1, insert at 0
            const insertIdx = index === -1 ? 0 : index + 1;
            newBlocks.splice(insertIdx, 0, newBlock);
            setBlocks(newBlocks);
        } else {
            setBlocks([...blocks, newBlock]);
            // Scroll to bottom only if added to end and using button logic
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
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            return data.url;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const handleDelete = async () => {
        if (!confirm(lang === 'de' ? 'Sind Sie sicher, dass Sie diesen Beitrag löschen möchten? Das kann nicht rückgängig gemacht werden.' : 'Are you sure you want to delete this post? This cannot be undone.')) return;

        setIsSaving(true);
        try {
            const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            router.push(`/${lang}`);
            router.refresh();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Fehler beim Löschen des Beitrags.');
            setIsSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        if (!title.trim()) {
            alert(lang === 'de' ? 'Bitte geben Sie einen Titel ein.' : 'Please enter a title.');
            setIsSaving(false);
            return;
        }

        try {
            const finalLocation = isCustomLocation ? customLocation : location;
            // Parse date
            const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            const eventDate = new Date(dateStr);

            if (isNaN(eventDate.getTime())) {
                alert('Bitte geben Sie ein gültiges Datum ein.');
                setIsSaving(false);
                return;
            }

            const payload = {
                title,
                coverImage,
                location: finalLocation,
                eventDate: eventDate.toISOString(),
                contentBlocks: JSON.stringify(blocks),
                content: blocks.map(b => b.content).join('\n') // Fallback simple content
            };

            const url = isEditing && postId ? `/api/posts/${postId}` : '/api/posts';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to save post');

            if (isEditing) {
                router.push(`/${lang}/posts/${postId}`);
            } else {
                router.push(`/${lang}`);
            }
            router.refresh();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Fehler beim Speichern des Beitrags.');
        } finally {
            setIsSaving(false);
        }
    };

    // Date helpers
    const currentYear = new Date().getFullYear();

    // Localized labels
    const t = {
        de: {
            insert: 'Einfügen',
            import: 'Import',
            text: 'Text',
            image: 'Bild',
            video: 'Video',
            pdf: 'PDF',
            link: 'Link',
            headline: 'Überschrift',
            magicImport: 'Beitrag importieren',
            magicImportDesc: 'Importiere Inhalte automatisch von Word, PDF oder Text.',
            back: 'Zurück',
            publish: 'Veröffentlichen',
            saving: 'Speichert...',
            title: 'Titel',
            titlePlaceholder: 'Titel des Beitrags',
            date: 'Datum',
            location: 'Kategorie / Tag',
            day: 'Tag',
            month: 'Monat',
            year: 'Jahr',
            coverImage: 'Titelbild hinzufügen',
            endOfPost: 'Ende des Beitrags',
            delete: 'Löschen',
        },
        en: {
            insert: 'Insert',
            import: 'Import',
            text: 'Text',
            image: 'Image',
            video: 'Video',
            pdf: 'PDF',
            link: 'Link',
            headline: 'Heading',
            magicImport: 'Import Post',
            magicImportDesc: 'Automatically import content from Word, PDF, or text.',
            back: 'Back',
            publish: 'Publish',
            saving: 'Saving...',
            title: 'Title',
            titlePlaceholder: 'Post Title',
            date: 'Date',
            location: 'Category / Tag',
            day: 'Day',
            month: 'Month',
            year: 'Year',
            coverImage: 'Add Cover Image',
            endOfPost: 'End of Post',
            delete: 'Delete',
        }
    }[lang as 'de' | 'en'] || {
        // Fallback
        insert: 'Einfügen',
        import: 'Import',
        text: 'Text',
        image: 'Bild',
        video: 'Video',
        pdf: 'PDF',
        link: 'Link',
        headline: 'Überschrift',
        magicImport: 'Beitrag importieren',
        magicImportDesc: 'Importiere Inhalte automatisch von Word, PDF oder Text.',
        back: 'Zurück',
        publish: 'Veröffentlichen',
        saving: 'Speichert...',
        title: 'Titel',
        titlePlaceholder: 'Titel des Beitrags',
        date: 'Datum',
        location: 'Kategorie / Tag',
        day: 'Tag',
        month: 'Monat',
        year: 'Jahr',
        coverImage: 'Titelbild hinzufügen',
        endOfPost: 'Ende des Beitrags',
        delete: 'Löschen',
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Simple Top Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} icon={<ArrowLeft size={18} />}>
                    {t.back}
                </Button>
                <div className="flex gap-2">
                    {/* Delete Button (Only in Edit Mode) */}
                    {isEditing && postId && (
                        <Button variant="ghost" onClick={handleDelete} disabled={isSaving} className="text-red-500 hover:text-red-600 hover:bg-red-50 px-4">
                            <Trash2 size={18} className="mr-2" />
                            {t.delete}
                        </Button>
                    )}
                    <Button variant="primary" onClick={handleSubmit} disabled={isSaving} isLoading={isSaving} className="rounded-none px-6">
                        {isSaving ? t.saving : t.publish}
                    </Button>
                </div>
            </div>

            <div className="max-w-[850px] mx-auto px-6 py-12 pb-32">
                <form onSubmit={handleSubmit} className="relative flex justify-center">

                    {/* Sticky Sidebar (Left) - Visible on large screens */}
                    <div className="hidden xl:flex flex-col fixed left-[max(2rem,calc(50%-720px))] top-32 gap-6 z-40 w-64">

                        {/* Tools Box */}
                        <div className="bg-white border border-slate-200 shadow-md p-2 rounded-none flex flex-col gap-1">
                            <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 pl-2 pt-2">{t.insert}</div>

                            <button type="button" onClick={() => addBlock('text')} className="relative group flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 hover:text-gmrt-blue transition-colors rounded-none text-left">
                                <Type size={18} className="text-slate-400" />
                                <span className="font-bold text-sm">{t.text}</span>
                            </button>
                            <button type="button" onClick={() => addBlock('headline')} className="relative group flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 hover:text-gmrt-blue transition-colors rounded-none text-left">
                                <Heading size={18} className="text-slate-400" />
                                <span className="font-bold text-sm">{t.headline}</span>
                            </button>
                            <button type="button" onClick={() => addBlock('image')} className="relative group flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 hover:text-gmrt-blue transition-colors rounded-none text-left">
                                <ImageIcon size={18} className="text-slate-400" />
                                <span className="font-bold text-sm">{t.image}</span>
                            </button>
                            <button type="button" onClick={() => addBlock('video')} className="relative group flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 hover:text-gmrt-blue transition-colors rounded-none text-left">
                                <Video size={18} className="text-slate-400" />
                                <span className="font-bold text-sm">{t.video}</span>
                            </button>
                            <button type="button" onClick={() => addBlock('pdf')} className="relative group flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 hover:text-gmrt-blue transition-colors rounded-none text-left">
                                <FileText size={18} className="text-slate-400" />
                                <span className="font-bold text-sm">{t.pdf}</span>
                            </button>
                            <button type="button" onClick={() => addBlock('link')} className="relative group flex items-center gap-3 p-3 hover:bg-slate-50 text-slate-600 hover:text-gmrt-blue transition-colors rounded-none text-left">
                                <LinkIcon size={18} className="text-slate-400" />
                                <span className="font-bold text-sm">{t.link}</span>
                            </button>
                        </div>


                    </div>

                    {/* Main Document Sheet */}
                    <div id="content-blocks-container" className="flex-grow max-w-[850px] bg-white min-h-[90vh] pb-32 rounded-none shadow-sm border border-slate-200 overflow-visible relative">

                        {/* 1. Cover Image (Full Width Top) */}
                        <div className="relative w-full bg-slate-50 border-b border-slate-100 group">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0]).then(url => setCoverImage(url))}
                            />

                            {coverImage ? (
                                <div className="aspect-[21/9] w-full relative">
                                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-white text-slate-700 px-4 py-2 rounded-sm shadow-sm font-bold text-sm hover:bg-gmrt-blue hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <Wand2 size={16} />
                                            {lang === 'de' ? 'Bild ändern' : 'Change Image'}
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setCoverImage('')}
                                        title={lang === 'de' ? 'Bild entfernen' : 'Remove image'}
                                        className="absolute top-4 right-4 bg-white/90 p-2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-slate-500 hover:text-red-500 rounded-none border border-slate-200"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center aspect-[21/9] w-full text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors gap-3 border-2 border-transparent hover:border-dashed hover:border-slate-300" onClick={() => fileInputRef.current?.click()}>
                                    <ImageIcon size={32} />
                                    <span className="font-medium text-lg">{t.coverImage}</span>
                                </label>
                            )}
                        </div>

                        <div className="px-12 md:px-16 pt-12 space-y-12">
                            {/* 2. Metadata Inputs (Boxy & Visible) */}
                            <div className="space-y-8">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Titel</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full text-4xl font-extrabold text-slate-900 placeholder:text-slate-300 border border-slate-200 focus:border-gmrt-blue focus:ring-0 p-5 bg-slate-50/30 hover:bg-slate-50 focus:bg-white rounded-none leading-tight transition-colors"
                                        placeholder="Titel des Beitrags"
                                        required
                                    />
                                </div>

                                {/* Date & Location Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Date - 3 Separate Fields */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Datum</label>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    value={day}
                                                    onChange={(e) => setDay(e.target.value)}
                                                    placeholder="DD"
                                                    className="w-full border border-slate-200 bg-slate-50/50 p-3 text-center font-bold focus:border-gmrt-blue outline-none rounded-none transition-colors"
                                                />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wide mt-1 block text-center">Tag</span>
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    value={month}
                                                    onChange={(e) => setMonth(e.target.value)}
                                                    placeholder="MM"
                                                    className="w-full border border-slate-200 bg-slate-50/50 p-3 text-center font-bold focus:border-gmrt-blue outline-none rounded-none transition-colors"
                                                />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wide mt-1 block text-center">Monat</span>
                                            </div>
                                            <div className="flex-[1.5]">
                                                <input
                                                    type="number"
                                                    value={year}
                                                    onChange={(e) => setYear(e.target.value)}
                                                    placeholder="YYYY"
                                                    className="w-full border border-slate-200 bg-slate-50/50 p-3 text-center font-bold focus:border-gmrt-blue outline-none rounded-none transition-colors"
                                                />
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wide mt-1 block text-center">Jahr</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{t.location}</label>
                                        {isCustomLocation ? (
                                            <input
                                                type="text"
                                                value={customLocation}
                                                onChange={(e) => setCustomLocation(e.target.value)}
                                                className="w-full border border-slate-200 bg-slate-50/50 p-3 font-medium focus:border-gmrt-blue outline-none rounded-none transition-colors"
                                                placeholder={lang === 'de' ? "Kategorie eingeben" : "Enter category"}
                                                autoFocus
                                            />
                                        ) : (
                                            <select
                                                value={location}
                                                onChange={handleLocationChange}
                                                className="w-full border border-slate-200 bg-slate-50/50 p-3 font-medium focus:border-gmrt-blue outline-none rounded-none cursor-pointer transition-colors"
                                            >
                                                {locations.map(loc => (
                                                    <option key={loc} value={loc}>{loc}</option>
                                                ))}
                                            </select>
                                        )}
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wide mt-1 block hover:text-gmrt-blue cursor-pointer" onClick={() => setIsCustomLocation(!isCustomLocation)}>
                                            {isCustomLocation ? (lang === 'de' ? 'Zurück zur Auswahl' : 'Back to selection') : (lang === 'de' ? '+ Eigene Kategorie' : '+ Custom Category')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100 my-8" />

                            {/* 3. Content Blocks with Hover Insertion */}
                            <div className="space-y-4">
                                {/* Empty State Actions (Permanent Insertion Bar) */}
                                {blocks.length === 0 && (
                                    <div className="h-32 flex flex-col justify-center items-center gap-4 py-8">
                                        <div className="relative flex items-center justify-center w-full max-w-lg">
                                            <div className="absolute left-0 right-0 h-px bg-gmrt-blue/10 pointer-events-none"></div>
                                            <div className="flex items-center gap-1 bg-white border border-slate-200 shadow-md p-1 px-4 rounded-none relative z-10 transition-transform hover:scale-105">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 select-none border-r border-slate-200 pr-2">{t.insert}</span>
                                                <button type="button" onClick={() => addBlock('text')} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <Type size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.text}</div>
                                                </button>
                                                <button type="button" onClick={() => addBlock('headline')} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <Heading size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.headline}</div>
                                                </button>
                                                <button type="button" onClick={() => addBlock('image')} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <ImageIcon size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.image}</div>
                                                </button>
                                                <button type="button" onClick={() => addBlock('video')} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <Video size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.video}</div>
                                                </button>
                                                <button type="button" onClick={() => addBlock('pdf')} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <FileText size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.pdf}</div>
                                                </button>
                                                <button type="button" onClick={() => addBlock('link')} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <LinkIcon size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.link}</div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Top Insertion Bar (Above first block) */}
                                {blocks.length > 0 && (
                                    <div className="h-4 group/top-insert relative z-30 flex justify-center items-center hover:h-16 transition-all duration-200 -mb-4">
                                        <div className="absolute top-1/2 left-4 right-4 h-px bg-gmrt-blue/10 opacity-0 group-hover/top-insert:opacity-100 transition-opacity pointer-events-none"></div>

                                        <div className="flex items-center gap-1 bg-white border border-slate-200 shadow-md p-1 px-4 rounded-none scale-0 opacity-0 group-hover/top-insert:scale-100 group-hover/top-insert:opacity-100 transition-all duration-200 relative z-30">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 select-none border-r border-slate-200 pr-2">{t.insert}</span>
                                            <button type="button" onClick={() => addBlock('text', -1)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                <Type size={14} />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.text}</div>
                                            </button>
                                            <button type="button" onClick={() => addBlock('headline', -1)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                <Heading size={14} />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.headline}</div>
                                            </button>
                                            <button type="button" onClick={() => addBlock('image', -1)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                <ImageIcon size={14} />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.image}</div>
                                            </button>
                                            <button type="button" onClick={() => addBlock('video', -1)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                <Video size={14} />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.video}</div>
                                            </button>
                                            <button type="button" onClick={() => addBlock('pdf', -1)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                <FileText size={14} />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.pdf}</div>
                                            </button>
                                            <button type="button" onClick={() => addBlock('link', -1)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                <LinkIcon size={14} />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.link}</div>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <AnimatePresence mode='popLayout'>                                    {blocks.map((block, index) => (
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
                                        <div className="py-6"> {/* Added generous padding for spacing */}
                                            <EditorBlock
                                                block={block}
                                                index={index}
                                                isFirst={index === 0}
                                                isLast={index === blocks.length - 1}
                                                onUpdate={updateBlock}
                                                onRemove={removeBlock}
                                                onMove={moveBlock}
                                                onFileUpload={handleFileUpload}
                                            />
                                        </div>

                                        {/* Hover Insertion Bar (Between Blocks) */}
                                        <div className={`absolute -bottom-8 left-0 right-0 z-20 h-16 flex justify-center items-center opacity-0 group-hover/wrapper:opacity-100 hover:opacity-100 transition-opacity`}>
                                            {/* Visual Line */}
                                            <div className="absolute top-1/2 left-4 right-4 h-px bg-gmrt-blue/10 pointer-events-none"></div>

                                            <div className="flex items-center gap-1 bg-white border border-slate-200 shadow-md p-1 px-4 rounded-none scale-95 hover:scale-100 transition-transform relative z-30">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 select-none border-r border-slate-200 pr-2">{t.insert}</span>
                                                <button type="button" onClick={() => addBlock('text', index)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <Type size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.text}</div>
                                                </button>
                                                <button type="button" onClick={() => addBlock('headline', index)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <Heading size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.headline}</div>
                                                </button>
                                                <button type="button" onClick={() => addBlock('image', index)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <ImageIcon size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.image}</div>
                                                </button>
                                                <button type="button" onClick={() => addBlock('video', index)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <Video size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.video}</div>
                                                </button>
                                                <button type="button" onClick={() => addBlock('pdf', index)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <FileText size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.pdf}</div>
                                                </button>
                                                <button type="button" onClick={() => addBlock('link', index)} className="relative group flex items-center gap-1 px-2 py-2 hover:bg-slate-50 text-slate-500 hover:text-gmrt-blue text-xs font-bold uppercase tracking-wide rounded-sm">
                                                    <LinkIcon size={14} />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">{t.link}</div>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </form>
            </div >

        </div >
    );
}
