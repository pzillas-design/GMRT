"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

export const MainContent = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    // Pages that have a hero section and shouldn't have top padding
    const heroPages = ['/', '/about', '/contact'];
    const hasHero = heroPages.includes(pathname);

    return (
        <main className={`min-h-screen ${!hasHero ? 'pt-24' : ''}`}>
            {children}
        </main>
    );
};
