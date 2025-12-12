'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { LoginForm } from './LoginForm';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="pt-2 pb-2">
                <LoginForm onSuccess={onSuccess} />
            </div>
        </Modal>
    );
}
