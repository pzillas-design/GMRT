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
        } catch (error) {
            toastError("Upload failed");
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
        <div className="min-h-screen bg-slate-50">
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

            {/* Top Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} icon={<ArrowLeft size={18} />}>
                    {t.back}
                </Button>
                <div className="flex gap-2">
                    {isEditing && postId && (
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(true)} disabled={isSaving} className="text-red-500 hover:text-red-600 hover:bg-red-50 px-4">
                            <Trash2 size={18} className="mr-2" />
                            {t.delete}
                        </Button>
                    )}
                    <Button variant="primary" onClick={handleSubmit} disabled={isSaving} isLoading={isSaving} className="rounded-none px-6">
                        {isSaving ? t.saving : t.publish}
                    </Button>
                </div>
            </div>

            <div className="max-w-[850px] mx-auto px-6 py-12 pb-12">
                <form onSubmit={handleSubmit} className="relative">

                    {/* Main Content */}
                    <div id="content-blocks-container" className="bg-white min-h-[50vh] rounded-none shadow-sm border border-slate-200 overflow-visible relative">

                        {/* Cover Image */}
                        <div className="relative w-full bg-slate-50 border-b border-slate-100 group">
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
                                                toastError(lang === 'de' ? 'Bild-Upload fehlgeschlagen' : 'Image upload failed');
                                            });
                                    }
                                }}
                            />

                            {coverImage ? (
                                <div className="aspect-[21/9] w-full relative">
                                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
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

                        <div className="px-12 md:px-16 pt-12 space-y-12 pb-12">
                            {/* Metadata */}
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{t.title}</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full text-4xl font-extrabold text-slate-900 placeholder:text-slate-400 placeholder:font-normal border border-slate-400 focus:border-black focus:ring-0 p-5 bg-slate-50/30 hover:bg-slate-50 focus:bg-white rounded-none leading-tight transition-colors"
                                        placeholder={lang === 'de' ? 'Titel des Beitrags' : 'Post Title'}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Datum</label>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <input type="number" value={day} onChange={(e) => setDay(e.target.value)} placeholder="DD" className="w-full border border-slate-400 bg-slate-50/50 p-3 text-center font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-black outline-none rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                            </div>
                                            <div className="flex-1">
                                                <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="MM" className="w-full border border-slate-400 bg-slate-50/50 p-3 text-center font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-black outline-none rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                            </div>
                                            <div className="flex-[1.5]">
                                                <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="YYYY" className="w-full border border-slate-400 bg-slate-50/50 p-3 text-center font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-black outline-none rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{t.location}</label>
                                        {isCustomLocation ? (
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={customLocation}
                                                    onChange={(e) => setCustomLocation(e.target.value)}
                                                    className="w-full border border-slate-400 bg-slate-50/50 p-3 pr-10 font-medium text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:border-black outline-none rounded-none"
                                                    placeholder={lang === 'de' ? "Kategorie eingeben" : "Enter category"}
                                                    autoFocus
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCustomLocation(false)}
                                                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-gmrt-blue bg-transparent flex items-center justify-center transition-colors"
                                                    title={lang === 'de' ? 'Zurück zur Auswahl' : 'Back to selection'}
                                                >
                                                    <span className="text-xl leading-none">&times;</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <select
                                                value={location}
                                                onChange={(e) => {
                                                    if (e.target.value === 'custom_new_entry') {
                                                        setIsCustomLocation(true);
                                                    } else {
                                                        setLocation(e.target.value);
                                                    }
                                                }}
                                                className="w-full border border-slate-400 bg-slate-50/50 p-3 font-medium text-slate-900 focus:border-black outline-none rounded-none cursor-pointer"
                                            >
                                                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                                <option value="custom_new_entry">{lang === 'de' ? '+ Neu...' : '+ New...'}</option>
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>

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
                    </div>

                    {/* PERMANENT BOTTOM TOOLBAR */}
                    <div className="mt-8 flex flex-col items-start gap-3 w-full pb-12">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.insert}</span>
                        <div className="grid grid-cols-6 w-full gap-2">
                            <button type="button" onClick={() => addBlock('text')} className="flex flex-col items-center justify-center gap-2 py-4 text-white bg-gradient-to-b from-gmrt-salmon to-[#E07A66] hover:opacity-90 transition-all rounded-md shadow-sm">
                                <Type size={24} />
                                <span className="text-sm font-normal">{t.text}</span>
                            </button>
                            <button type="button" onClick={() => addBlock('headline')} className="flex flex-col items-center justify-center gap-2 py-4 text-white bg-gradient-to-b from-gmrt-salmon to-[#E07A66] hover:opacity-90 transition-all rounded-md shadow-sm">
                                <Heading size={24} />
                                <span className="text-sm font-normal">{t.headline}</span>
                            </button>
                            <button type="button" onClick={() => addBlock('image')} className="flex flex-col items-center justify-center gap-2 py-4 text-white bg-gradient-to-b from-gmrt-salmon to-[#E07A66] hover:opacity-90 transition-all rounded-md shadow-sm">
                                <ImageIcon size={24} />
                                <span className="text-sm font-normal">{t.image}</span>
                            </button>
                            <button type="button" onClick={() => addBlock('video')} className="flex flex-col items-center justify-center gap-2 py-4 text-white bg-gradient-to-b from-gmrt-salmon to-[#E07A66] hover:opacity-90 transition-all rounded-md shadow-sm">
                                <Video size={24} />
                                <span className="text-sm font-normal">{t.video}</span>
                            </button>
                            <button type="button" onClick={() => addBlock('pdf')} className="flex flex-col items-center justify-center gap-2 py-4 text-white bg-gradient-to-b from-gmrt-salmon to-[#E07A66] hover:opacity-90 transition-all rounded-md shadow-sm">
                                <FileText size={24} />
                                <span className="text-sm font-normal">{t.pdf}</span>
                            </button>
                            <button type="button" onClick={() => addBlock('link')} className="flex flex-col items-center justify-center gap-2 py-4 text-white bg-gradient-to-b from-gmrt-salmon to-[#E07A66] hover:opacity-90 transition-all rounded-md shadow-sm">
                                <LinkIcon size={24} />
                                <span className="text-sm font-normal">{t.link}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
