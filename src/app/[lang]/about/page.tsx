import React from 'react';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { getDictionary } from '@/get-dictionary';
import { Mail } from 'lucide-react';
import { ObfuscatedMail } from '@/components/ObfuscatedMail';

export const metadata = {
    title: 'Über uns - GMRT',
    description: 'GMRT, für Unternehmen, Investoren und Forschende mit Fokus auf ASEAN.',
};

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict: any = await getDictionary(lang as 'de' | 'en');

    return (
        <div className="bg-white text-slate-900">
            <PageHero
                title={dict.about.hero.title}
                subtitle={dict.about.hero.subtitle}
                imageSrc="https://images.unsplash.com/photo-1594950474627-f49c063b4b45?q=80&w=2000&auto=format&fit=crop"
            />

            {/* 1. Mission Section (White) */}
            <section className="py-24 bg-white">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
                        {/* Left: Headline */}
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0E2A47] leading-tight">
                            {dict.about.mission.lead}
                        </h2>

                        {/* Right: Copy */}
                        <div className="prose prose-lg prose-slate text-slate-600">
                            <p className="text-lg md:text-xl leading-relaxed">
                                {dict.about.mission.text}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Principles Section (Slate-50) */}
            <section className="py-24 bg-slate-50 border-y border-slate-100">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                    <div className="max-w-4xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#0E2A47] mb-12 text-center">
                            {dict.about.principles.title}
                        </h3>
                        <div className="grid gap-6 md:grid-cols-3">
                            {dict.about.principles.items.map((item: any, index: number) => (
                                <div key={index} className="flex gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                    <span className="text-gmrt-salmon font-bold text-xl">•</span>
                                    <span className="text-lg text-slate-700 leading-relaxed">
                                        <strong>{item.bold}</strong> {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Team Section (White) */}
            <section className="py-24 bg-white">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-16 text-center">
                        {dict.about.team.title}
                    </h2>

                    {/* Team Grid - Increased gap */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                        {dict.about.team.members?.map((member: any, index: number) => (
                            <div key={index} className="group">
                                <div className="overflow-hidden rounded-2xl mb-6 bg-slate-100 shadow-sm relative aspect-video">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-2xl font-bold text-[#0E2A47] mb-1">{member.name}</h3>
                                    <p className="text-gmrt-salmon font-bold uppercase tracking-wider text-sm mb-4">{member.role}</p>
                                    <p className="text-slate-600 leading-relaxed mb-6 max-w-sm">
                                        {member.bio}
                                    </p>
                                    <ObfuscatedMail
                                        email={member.email}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-lg text-sm font-bold transition-all duration-200 text-slate-600 uppercase tracking-wide"
                                    >
                                        <Mail size={18} />
                                        <span>E-Mail</span>
                                    </ObfuscatedMail>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
