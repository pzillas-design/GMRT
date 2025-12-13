import Link from 'next/link';
import { Mail, Github, Linkedin, Euro } from 'lucide-react';
import { ObfuscatedMail } from '@/components/ObfuscatedMail';
import { GmrtLogo } from '@/components/GmrtLogo';
import React from 'react';
import { Container } from '@/components/ui/Container';

export default function Footer({ dict, navDict, lang }: { dict: any, navDict: any, lang: string }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gmrt-blue text-white py-16">
            <Container size="xl">
                <div className="grid grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-2 lg:col-span-5">
                        <Link href={`/${lang}`} className="inline-flex items-center gap-3 group mb-6">
                            <GmrtLogo className="h-16 w-auto text-gmrt-salmon transition-transform duration-300 group-hover:scale-105" />
                            <span className="font-display font-semibold text-4xl tracking-wide text-white group-hover:text-gmrt-salmon transition-colors">
                                GMRT
                            </span>
                        </Link>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-sm">
                            {dict.subtitle || "German-Malaysian Round Table – Die Plattform für wirtschaftlichen und kulturellen Austausch."}
                        </p>

                    </div>

                    {/* Navigation Links */}
                    <div className="col-span-1 lg:col-span-3 lg:col-start-7">
                        <h3 className="text-white font-bold text-lg mb-6">{dict.navigation_title || 'Navigation'}</h3>
                        <ul className="space-y-4">
                            <li><Link href={`/${lang}`} className="text-slate-300 hover:text-gmrt-salmon transition-colors">{navDict?.home || 'Home'}</Link></li>
                            <li><Link href={`/${lang}/about`} className="text-slate-300 hover:text-gmrt-salmon transition-colors">{navDict?.about || 'About'}</Link></li>
                            <li><Link href={`/${lang}/news`} className="text-slate-300 hover:text-gmrt-salmon transition-colors">{navDict?.news || 'News'}</Link></li>
                            <li><Link href={`/${lang}/contact`} className="text-slate-300 hover:text-gmrt-salmon transition-colors">{navDict?.contact || 'Contact'}</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="col-span-1 lg:col-span-3">
                        <h3 className="text-white font-bold text-lg mb-6">{dict.legal_title || 'Rechtliches'}</h3>
                        <ul className="space-y-4">
                            <li><Link href={`/${lang}/impressum`} className="text-slate-300 hover:text-gmrt-salmon transition-colors">{dict.impressum}</Link></li>
                            <li><Link href={`/${lang}/privacy`} className="text-slate-300 hover:text-gmrt-salmon transition-colors">{dict.privacy}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-sm text-slate-400">
                    <p>&copy; {currentYear} German Malaysian Round Table. {dict.rights}</p>
                </div>
            </Container>
        </footer>
    );
}
