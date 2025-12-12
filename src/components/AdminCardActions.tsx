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
            <div className="flex gap-2 relative z-20" onClick={(e) => e.preventDefault()}>
                <Link
                    href={`/${lang}/edit/${postId}`}
                    className="p-2 bg-white/80 hover:bg-white text-slate-500 hover:text-gmrt-blue rounded-lg shadow-sm border border-slate-200 transition-colors"
                    title={lang === 'de' ? 'Bearbeiten' : 'Edit'}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Pencil size={16} />
                </Link>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDeleteModalOpen(true);
                    }}
                    className="p-2 bg-white/80 hover:bg-white text-slate-500 hover:text-red-500 rounded-lg shadow-sm border border-slate-200 transition-colors"
                    title={lang === 'de' ? 'Löschen' : 'Delete'}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </>
    );
};
