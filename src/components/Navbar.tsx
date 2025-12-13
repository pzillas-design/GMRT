'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { GmrtLogo } from '@/components/GmrtLogo';
import { useAuth } from '@/context/AuthContext';
import { ConfirmationModal } from '@/components/ui/Modal';
import { LoginModal } from '@/components/auth/LoginModal';

interface NavbarProps {
    lang: 'de' | 'en';
    dict: any;
}

export default function Navbar({ lang, dict }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

    const handleLogout = async () => {
        await logout();
        setIsLogoutModalOpen(false);
        router.refresh();
    };

    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false);
        router.push(`/${lang}/news`);
        router.refresh();
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
        <nav className={`fixed w-full z-[100] transition-colors duration-500 py-4 md:py-6 ${showBackground ? 'bg-white/95 shadow-md' : 'bg-transparent'}`}>
            <Container size="xl">
                <ConfirmationModal
                    isOpen={isLogoutModalOpen}
                    onClose={() => setIsLogoutModalOpen(false)}
                    onConfirm={handleLogout}
                    title={lang === 'de' ? 'Abmelden?' : 'Log out?'}
                    message={lang === 'de' ? 'Möchten Sie sich wirklich abmelden?' : 'Are you sure you want to log out?'}
                    confirmText={lang === 'de' ? 'Abmelden' : 'Log out'}
                    cancelText={lang === 'de' ? 'Abbrechen' : 'Cancel'}
                />

                <LoginModal
                    isOpen={isLoginModalOpen}
                    onClose={() => setIsLoginModalOpen(false)}
                    onSuccess={handleLoginSuccess}
                />

                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href={`/${lang}`} className="flex items-center gap-3 group">
                            <GmrtLogo className="h-11 md:h-16 w-auto transition-transform duration-300 group-hover:scale-105 text-gmrt-salmon" />
                            <span className={`font-display font-bold text-2xl md:text-3xl tracking-wide mt-1 ${isDarkText ? 'text-gmrt-blue' : 'text-white'}`}>
                                GMRT
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== `/${lang}` && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-lg text-lg tracking-wide transition-all ${isActive
                                        ? 'font-bold'
                                        : 'font-normal'
                                        } ${isDarkText
                                            ? (isActive ? 'text-gmrt-blue bg-slate-50' : 'text-slate-600 hover:text-gmrt-salmon hover:bg-slate-50')
                                            : (isActive ? 'text-white bg-white/10' : 'text-white/90 hover:text-gmrt-salmon hover:bg-white/10')
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Icons / Actions */}
                    <div className={`hidden md:flex items-center space-x-4 ${isDarkText ? 'text-slate-600' : 'text-white/90'}`}>
                        <button onClick={toggleLanguage} className={`px-3 py-2 rounded-lg cursor-pointer text-base font-medium flex items-center gap-1 transition-colors ${isDarkText ? 'hover:bg-slate-50' : 'hover:bg-white/10'} hover:text-gmrt-salmon`}>
                            <span className={lang === 'de' ? 'font-bold' : 'opacity-70'}>DE</span>
                            <span className="opacity-50">|</span>
                            <span className={lang === 'en' ? 'font-bold' : 'opacity-70'}>EN</span>
                        </button>

                        {isAuthenticated ? (
                            <button
                                onClick={() => setIsLogoutModalOpen(true)}
                                className={`cursor-pointer p-2 rounded-full transition-colors text-gmrt-salmon ${isDarkText ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
                                title={lang === 'de' ? 'Abmelden' : 'Log out'}
                            >
                                <LogOut size={24} />
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className={`cursor-pointer p-2 rounded-full transition-colors hover:text-gmrt-salmon ${isDarkText ? 'hover:bg-slate-100' : 'hover:bg-white/10'}`}
                                title={lang === 'de' ? 'Anmelden' : 'Login'}
                            >
                                <User size={24} />
                            </button>
                        )}
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
                        {/* Mobile Auth Button */}
                        <div className="border-t border-slate-100 pt-4 mt-2">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        setIsLogoutModalOpen(true); // Modal handles logic
                                        // keeping menu open? No, modal is overlay.
                                        // Menu is z-50? Modal is z-90. Ideally close menu.
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 text-lg font-medium text-gmrt-salmon px-2 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <LogOut size={22} />
                                    <span>{lang === 'de' ? 'Abmelden' : 'Log out'}</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsLoginModalOpen(true);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 text-lg font-medium text-slate-700 px-2 py-2 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <User size={22} />
                                    <span>{lang === 'de' ? 'Anmelden' : 'Login'}</span>
                                </button>
                            )}
                        </div>

                        <button onClick={() => { toggleLanguage(); setIsOpen(false); }} className="text-xl py-3 font-medium text-slate-600 hover:text-gmrt-blue flex items-center gap-4 border-t border-slate-100 pt-4">
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
