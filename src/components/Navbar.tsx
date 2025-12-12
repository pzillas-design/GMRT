'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, User, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { GmrtLogo } from '@/components/GmrtLogo';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
    lang: 'de' | 'en';
    dict: any;
}

export default function Navbar({ lang, dict }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated } = useAuth();

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

    const toggleLanguage = () => {
        const newLang = lang === 'de' ? 'en' : 'de';
        const segments = pathname.split('/');
        if (segments.length > 1) {
            segments[1] = newLang;
        } else {
            segments.splice(0, 0, "", newLang);
        }
        const newPath = segments.join('/');
        router.push(newPath || `/${newLang}`);
    };

    const getNavStyle = (path: string): 'light' | 'dark' | 'solid' => {
        if (path === `/${lang}`) return 'light';
        if (path === `/${lang}/news`) return 'dark';
        if (path.startsWith(`/${lang}/posts/`)) return 'light';
        if (path === `/${lang}/about` || path === `/${lang}/contact`) return 'light';
        return 'solid';
    };

    const navStyle = getNavStyle(pathname);
    const isTransparent = navStyle === 'light' || navStyle === 'dark';
    const showBackground = isScrolled || !isTransparent;
    const isDarkText = showBackground || navStyle === 'dark';

    const isEditorPage = pathname.includes('/create') || pathname.includes('/edit');
    if (isEditorPage) return null;

    return (
        <nav className={`fixed w-full z-50 transition-colors duration-500 py-4 md:py-6 ${showBackground ? 'bg-white/95 shadow-md' : 'bg-transparent'}`}>
            <Container size="xl">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href={`/${lang}`} className="flex items-center gap-3 group">
                            <GmrtLogo className="h-11 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105 text-gmrt-salmon" />
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
                        <button onClick={toggleLanguage} className={`cursor-pointer text-base font-medium flex items-center gap-1 hover:text-gmrt-salmon transition-colors border-r border-current pr-4 mr-4`}>
                            <span className={lang === 'de' ? 'font-bold' : 'opacity-70'}>DE</span>
                            <span className="opacity-50">|</span>
                            <span className={lang === 'en' ? 'font-bold' : 'opacity-70'}>EN</span>
                        </button>

                        <Link
                            href={`/${lang}/login`}
                            className={`hover:text-gmrt-salmon transition-colors ${isAuthenticated ? 'text-gmrt-salmon' : ''}`}
                            title={isAuthenticated ? (lang === 'de' ? 'Angemeldet' : 'Logged in') : (lang === 'de' ? 'Anmelden' : 'Login')}
                        >
                            {isAuthenticated ? <UserCheck size={24} /> : <User size={24} />}
                        </Link>
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
