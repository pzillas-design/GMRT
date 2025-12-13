'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { ConfirmationModal } from '@/components/ui/Modal';

interface AdminCardActionsProps {
    postId: string | number;
    lang?: string;
}

export const AdminCardActions = ({ postId, lang = 'de' }: AdminCardActionsProps) => {
    const router = useRouter();
    const { success, error } = useToast();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            success(lang === 'de' ? 'Beitrag gelöscht' : 'Post deleted');
            router.refresh();
        } catch (err) {
            console.error(err);
            error(lang === 'de' ? 'Fehler beim Löschen' : 'Error deleting post');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <>
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
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200/60 relative z-20" onClick={(e) => e.preventDefault()}>
                <Link
                    href={`/${lang}/edit/${postId}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide bg-gradient-to-r from-gmrt-salmon to-gmrt-logo text-white hover:opacity-90 shadow-sm transition-all"
                    title={lang === 'de' ? 'Bearbeiten' : 'Edit'}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Pencil size={16} />
                    <span>{lang === 'de' ? 'Bearbeiten' : 'Edit'}</span>
                </Link>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDeleteModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                    title={lang === 'de' ? 'Löschen' : 'Delete'}
                >
                    <Trash2 size={16} />
                    <span>{lang === 'de' ? 'Löschen' : 'Delete'}</span>
                </button>
            </div>
        </>
    );
};
