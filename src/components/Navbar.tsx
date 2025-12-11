"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';

interface NavbarProps {
    lang: 'de' | 'en';
    dict: any; // We can type this strictly later
}

export default function Navbar({ lang, dict }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: dict.home, href: `/${lang}` },
        { label: dict.about, href: `/${lang}/about` },
        { label: dict.news, href: `/${lang}/news` },
        { label: dict.contact, href: `/${lang}/contact` },
    ];

    // Language Switcher Logic
    const toggleLanguage = () => {
        const newLang = lang === 'de' ? 'en' : 'de';
        // Replace the language segment in the current path
        // Path is something like /de/about or /de or /de/news
        const segments = pathname.split('/');
        // pathname format: /lang/path... => ["", "de", "path"...]
        if (segments.length > 1) {
            segments[1] = newLang;
        } else {
            // Should not happen with middleware, but fallback
            segments.splice(0, 0, "", newLang);
        }

        const newPath = segments.join('/');
        router.push(newPath || `/${newLang}`);
    };

    // Text color logic: White on transparent background (unscrolled transparent page), Dark on white background
    // Transparent pages: Home, About, Contact
    // But now paths are /en/about etc.
    // Configuration for Navbar styles based on route
    // 'transparent-white': Transparent BG, White Text (for dark images)
    // 'transparent-dark': Transparent BG, Dark Text (for light images)
    // 'solid': White BG, Dark Text (default)
    // Configuration for Navbar styles based on route
    // 'light': Transparent BG, White Text (for Dark Backgrounds/Images) -> Default for Home, News, Posts
    // 'dark': Transparent BG, Dark Text (for Light Backgrounds) -> Maybe Contact/About if they have light headers
    // 'solid': White BG, Dark Text (for pages with no header image)
    const getNavStyle = (path: string): 'light' | 'dark' | 'solid' => {
        if (path === `/${lang}`) return 'light';
        if (path === `/${lang}/news`) return 'dark'; // News uses Light Gray BG -> Dark Text
        if (path.startsWith(`/${lang}/posts/`)) return 'light'; // Posts have dark header image -> White Text
        if (path === `/${lang}/about` || path === `/${lang}/contact`) return 'light'; // Standard pages often have Hero Images -> White Text
        return 'solid';
    };

    const navStyle = getNavStyle(pathname);
    const isTransparent = navStyle === 'light' || navStyle === 'dark';

    // State: Show background if scrolled OR if the page is not transparent (solid)
    const showBackground = isScrolled || !isTransparent;

    // Text Color Logic: 
    // - Scrolled? -> Dark
    // - Solid Page? -> Dark
    // - Transparent Page? -> Depends on style ('light' -> White, 'dark' -> Dark)
    const isDarkText = showBackground || navStyle === 'dark';

    const isEditorPage = pathname.includes('/create') || pathname.includes('/edit');
    if (isEditorPage) return null;

    return (
        <nav className={`fixed w-full z-50 transition-colors duration-500 py-4 md:py-6 ${showBackground ? 'bg-white/95 shadow-md' : 'bg-transparent'}`}>
            <Container size="xl">
                <div className="flex justify-between items-center">

                    {/* Logo - SVG Icon + Text */}
                    <div className="flex-shrink-0">
                        <Link href={`/${lang}`} className="flex items-center gap-3 group">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 979 1024"
                                className="h-14 md:h-20 w-auto transition-transform duration-300 group-hover:scale-105"
                            >
                                <path
                                    fill="#F29985"
                                    d="M511 68a594 594 0 0 1 62 3 360 360 0 0 1 15 1l16 2c72 15 138 46 187 100l24 26c9 11 16 23 24 35 6 13 23 42 24 57l-3 3c-12 9-21 13-37 12-20-3-29-29-39-44a338 338 0 0 0-257-158 417 417 0 0 0-369 177c-33 52-54 105-62 166-29 210 149 375 353 366 65-2 136-28 190-64l9-5c24-17 48-35 70-57a425 425 0 0 0 47-57l12-20c11-18 22-31 24-53-1-1-3-4-5-4-13-3-27 5-38 9-28 9-55 21-82 33l-36 19-39 16-21 11c-13 5-33 10-46 5-12-4-24-17-29-29-15-40 22-91 45-122 10-12 25-28 33-42v-4c-3-2-6-2-9-2-8 4-26 22-34 29-32 30-63 61-94 93l-28 32-30 32c-8 8-22 22-34 22-2 0-3-2-5-4-4-6-15-24-14-31 2-20 55-82 69-101l17-23 7-12c11-14 34-40 36-56 1-4 1-9-2-12l-4-1c-9-1-21 12-27 17l-34 30c-21 21-40 45-59 68l-44 50-33 47-11 15-16 15-4 2c-6 1-12-1-17-5-6-4-9-12-10-20s-1-14 2-21c6-11 15-19 23-29l25-32c15-18 28-37 42-56l14-18c5-7 26-40 24-49 0-3-2-6-5-8-2-2-5-1-8 0-6 1-12 5-18 7l-41 23-34 19c-15 9-36 26-53 29l-3-1c-3-3-6-10-6-14-1-13 14-30 23-39 3-4 7-6 11-9 10-5 22-7 32-12 24-11 46-25 71-34 10-3 21-6 32-6 9 0 17 1 24 8 20 19-5 55-10 77-1 5-2 9-1 14 15-8 26-21 37-34l23-18c23-25 50-53 81-67 14-7 34-5 40 11 7 21-19 54-30 71l-15 28c-2 3-5 11-1 13 12-3 30-24 38-33l16-16 38-32c22-17 79-70 106-70 10 0 21 9 27 16 4 4 7 9 5 15-4 10-16 18-23 26l-9 11-23 25-15 20c-6 7-13 14-18 22-10 13-20 29-27 44l-8 19c-6 13-13 23-13 38l1 6c10 0 40-17 50-22l60-27c19-9 39-18 59-25l23-7c11-3 24-7 36-7a68 68 0 0 1 71 68c2 56-66 143-103 183-17 17-34 32-53 47l-17 13-14 8-17 11-37 21-45 18-33 11c-26 8-70 15-97 16h-40c-16-1-33-4-49-7-12-3-25-4-37-8a392 392 0 0 1-233-175c-20-33-37-80-44-118l-3-21a422 422 0 0 1 193-407l17-12c15-9 30-16 46-23l18-10 42-15 31-10c36-10 73-12 110-13"
                                />
                            </svg>
                            <span className={`font-display font-medium text-2xl md:text-3xl tracking-wide mt-1 ${isDarkText ? 'text-gmrt-blue' : 'text-white'}`}>
                                GMRT
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== `/${lang}` && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`text-lg tracking-wide transition-all ${isActive
                                        ? 'font-bold underline decoration-2 underline-offset-8'
                                        : 'font-normal'
                                        } ${isDarkText
                                            ? (isActive ? 'text-gmrt-blue decoration-gmrt-salmon' : 'text-slate-600 hover:text-gmrt-salmon')
                                            : (isActive ? 'text-white decoration-white' : 'text-white/90 hover:text-gmrt-salmon')
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Icons / Actions */}
                    <div className={`hidden md:flex items-center space-x-6 ${isDarkText ? 'text-slate-600' : 'text-white/90'}`}>
                        <button onClick={toggleLanguage} className={`cursor-pointer text-base font-medium flex items-center gap-1 hover:text-gmrt-salmon transition-colors`}>
                            <span className={lang === 'de' ? 'font-bold' : 'opacity-70'}>DE</span>
                            <span className="opacity-50">|</span>
                            <span className={lang === 'en' ? 'font-bold' : 'opacity-70'}>EN</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? "Close Menu" : "Open Menu"}
                            className={`p-2 rounded-lg ${isDarkText ? 'text-gmrt-blue' : 'text-white'} hover:text-gmrt-salmon transition-colors`}
                        >
                            {isOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </Container>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-t border-slate-100 py-4 px-6 md:hidden shadow-xl">
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== `/${lang}` && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`text-2xl py-2 border-b border-slate-50 last:border-0 ${isActive
                                        ? 'font-bold text-gmrt-blue pl-2 border-l-4 border-l-gmrt-salmon'
                                        : 'font-light text-slate-600 hover:text-gmrt-blue'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                        <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="text-xl py-3 font-medium text-slate-600 hover:text-gmrt-blue flex items-center gap-4 mt-2 border-t border-slate-100 pt-4">
                            <span>Sprache / Language:</span>
                            <div className="flex bg-slate-100 rounded-lg p-1">
                                <span className={`px-3 py-1 rounded-md ${lang === 'de' ? 'bg-white shadow-sm text-gmrt-blue font-bold' : 'text-slate-500'}`}>DE</span>
                                <span className={`px-3 py-1 rounded-md ${lang === 'en' ? 'bg-white shadow-sm text-gmrt-blue font-bold' : 'text-slate-500'}`}>EN</span>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
