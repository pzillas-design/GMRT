'use client';

import React, { useState, useEffect } from 'react';

interface Props {
    email: string;
    className?: string;
    children?: React.ReactNode;
}

export function ObfuscatedMail({ email, className, children }: Props) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Split email for simple obfuscation in source
    const [user, domain] = email.split('@');

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = `mailto:${user}@${domain}`;
    };

    if (!isMounted) {
        return <span className={className}>{children || `${user} [at] ${domain}`}</span>;
    }

    return (
        <a
            href="#"
            onClick={handleClick}
            className={className}
            title="E-Mail senden"
        >
            {children ? children : <>{user} <span className="opacity-50">[at]</span> {domain}</>}
        </a>
    );
}
