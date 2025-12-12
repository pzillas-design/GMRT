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
        <div className="bg-white pb-20 text-slate-900">
            <PageHero
                title={dict.about.hero.title}
                subtitle={dict.about.hero.subtitle}
                imageSrc="/images/frankfurt.jpg"
            />

            {/* Main Content */}
            <section className="py-20">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                    {/* Mission Text */}
                    <div className="prose prose-lg prose-slate max-w-4xl mx-auto mb-20">
                        <p className="lead text-2xl text-[#0E2A47] font-light mb-8 leading-relaxed">
                            {dict.about.mission.lead}
                        </p>
                        <p className="mb-10 text-slate-700">
                            {dict.about.mission.text}
                        </p>

                        {/* Key Principles / Important Points */}
                        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 not-prose">
                            <h3 className="text-xl font-bold text-[#0E2A47] mb-4">{dict.about.principles.title}</h3>
                            <ul className="space-y-4 text-lg text-slate-700">
                                {dict.about.principles.items.map((item: any, index: number) => (
                                    <li key={index} className="flex gap-3">
                                        <span className="text-gmrt-salmon font-bold">•</span>
                                        <span>
                                            <strong>{item.bold}</strong> {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-[#0E2A47] mb-12 text-center">{dict.about.team.title}</h2>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {dict.about.team.members?.map((member: any, index: number) => (
                            <div key={index} className="group">
                                <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100 relative aspect-[4/3]">
                                    {/* Use next/image if available, otherwise img. The dict has paths. */}
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-[#0E2A47]">{member.name}</h3>
                                <p className="text-sm text-gmrt-salmon font-semibold uppercase tracking-wide mb-2">{member.role}</p>
                                <p className="text-sm text-slate-600 leading-relaxed min-h-[80px]">
                                    {member.bio}
                                </p>
                                <div className="mt-4">
                                    <ObfuscatedMail email={member.email} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-full text-sm font-medium transition-colors text-slate-600">
                                        <Mail size={16} />
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
