'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2 } from 'lucide-react';
import { ConfirmationModal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface PostActionsProps {
    postId: number;
    lang: string;
    isAdmin: boolean;
}

export function PostActions({ postId, lang, isAdmin }: PostActionsProps) {
    const router = useRouter();
    const { error: toastError, success: toastSuccess } = useToast();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Failed to delete post');
            }

            toastSuccess(lang === 'de' ? 'Beitrag gelöscht' : 'Post deleted');
            router.push(`/${lang}/news`);
            router.refresh();
        } catch (error) {
            console.error(error);
            toastError(lang === 'de' ? 'Fehler beim Löschen' : 'Error deleting post');
            setIsDeleting(false);
            setIsDeleteModalOpen(false); // Close modal on error so it doesn't get stuck
        }
    };

    if (!isAdmin) return null;

    return (
        <>
            <div className="flex items-center gap-3 self-start">
                <Link
                    href={`/${lang}/edit/${postId}`}
                    className="bg-gmrt-salmon text-white px-6 py-2 rounded-md font-bold uppercase tracking-wider hover:bg-white hover:text-gmrt-salmon transition-colors flex items-center gap-2 shadow-sm"
                >
                    <Edit2 size={16} />
                    <span>{lang === 'de' ? 'Bearbeiten' : 'Edit'}</span>
                </Link>
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="bg-slate-100 text-slate-500 px-4 py-2 rounded-md font-bold uppercase tracking-wider hover:bg-slate-200 hover:text-red-600 transition-colors flex items-center gap-2 shadow-sm"
                    title={lang === 'de' ? 'Löschen' : 'Delete'}
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title={lang === 'de' ? 'Beitrag löschen?' : 'Delete Post?'}
                message={lang === 'de'
                    ? 'Sind Sie sicher, dass Sie diesen Beitrag löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
                    : 'Are you sure you want to delete this post? This action cannot be undone.'
                }
                confirmText={lang === 'de' ? 'Löschen' : 'Delete'}
                cancelText={lang === 'de' ? 'Abbrechen' : 'Cancel'}
                isDanger
                isLoading={isDeleting}
            />
        </>
    );
}
