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
                imageSrc="/uploads/about-hero-final.jpg"
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
                        {/* Jai Shankar */}
                        <div className="group">
                            <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100">
                                <img
                                    src="/uploads/team/jai-shankar.jpg"
                                    alt="Jai Shankar"
                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[#0E2A47]">Jai Shankar</h3>
                            <p className="text-sm text-gmrt-salmon font-semibold uppercase tracking-wide mb-2">Gründer</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Mr. Jai Shankar was the Trade Commissioner (MATRADE) from 2012 to 2016 in Frankfurt. He created together with Mr. Paramsothy Thamotharampillai-Göbela an important platform for Germans and Malaysians.
                            </p>
                            <div className="mt-3">
                                <ObfuscatedMail email="frankfurt@gmrt.de" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-full text-sm font-medium transition-colors text-slate-600">
                                    <Mail size={16} />
                                    <span>E-Mail schreiben</span>
                                </ObfuscatedMail>
                            </div>
                        </div>

                        {/* Paramsothy Thamotharampillai-Göbel */}
                        <div className="group">
                            <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100">
                                <img
                                    src="/uploads/team/paramsothy.jpg"
                                    alt="Paramsothy Thamotharampillai-Göbel"
                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[#0E2A47]">Paramsothy T. Göbel</h3>
                            <p className="text-sm text-gmrt-salmon font-semibold uppercase tracking-wide mb-2">Gründer & GMRT Frankfurt</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Gebürtiger Malaysier, Ingenieur mit 27 Jahren Erfahrung in der Automobilindustrie. Interkultureller Experte für Indien, Sri Lanka und ASEAN.
                            </p>
                            <div className="mt-3">
                                <ObfuscatedMail email="frankfurt@gmrt.de" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-full text-sm font-medium transition-colors text-slate-600">
                                    <Mail size={16} />
                                    <span>E-Mail schreiben</span>
                                </ObfuscatedMail>
                            </div>
                        </div>

                        {/* Prof. Dr. Andreas Stoffers */}
                        <div className="group">
                            <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100">
                                <img
                                    src="/uploads/team/andreas-stoffers.jpg"
                                    alt="Prof. Dr. Andreas Stoffers"
                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[#0E2A47]">Prof. Dr. Andreas Stoffers</h3>
                            <p className="text-sm text-gmrt-salmon font-semibold uppercase tracking-wide mb-2">GMRT München</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Managing Director of ASEAN Business Partners GmbH and Professor of International Management. Expert on the ASEAN region.
                            </p>
                            <div className="mt-3">
                                <ObfuscatedMail email="muenchen@gmrt.de" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-full text-sm font-medium transition-colors text-slate-600">
                                    <Mail size={16} />
                                    <span>E-Mail schreiben</span>
                                </ObfuscatedMail>
                            </div>
                        </div>

                        {/* Roland Mauß */}
                        <div className="group">
                            <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100">
                                <img
                                    src="/uploads/team/roland-mauss.jpg"
                                    alt="Roland Mauß"
                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[#0E2A47]">Roland Mauß</h3>
                            <p className="text-sm text-gmrt-salmon font-semibold uppercase tracking-wide mb-2">GMRT Düsseldorf</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                CFO der Oryx Stainless AG seit 1997. Zuvor Ernst & Young. Engagiert in Wirtschaftsprüferkammer und VDI.
                            </p>
                            <div className="mt-3">
                                <ObfuscatedMail email="duesseldorf@gmrt.de" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-full text-sm font-medium transition-colors text-slate-600">
                                    <Mail size={16} />
                                    <span>E-Mail schreiben</span>
                                </ObfuscatedMail>
                            </div>
                        </div>

                        {/* Ludwig Graf Westarp */}
                        <div className="group">
                            <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100">
                                <img
                                    src="/uploads/team/ludwig-graf-westarp.jpg"
                                    alt="Ludwig Graf Westarp"
                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[#0E2A47]">Ludwig Graf Westarp</h3>
                            <p className="text-sm text-gmrt-salmon font-semibold uppercase tracking-wide mb-2">GMRT Berlin</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Gründer von SKARO VIETNAM. Fokus auf Internationalisierung, Wirtschaftsentwicklung und interkulturellem Management.
                            </p>
                            <div className="mt-3">
                                <ObfuscatedMail email="berlin@gmrt.de" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-full text-sm font-medium transition-colors text-slate-600">
                                    <Mail size={16} />
                                    <span>E-Mail schreiben</span>
                                </ObfuscatedMail>
                            </div>
                        </div>

                        {/* Christian Wachtmeister */}
                        <div className="group">
                            <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100">
                                <img
                                    src="/uploads/team/christian-wachtmeister.jpg"
                                    alt="Christian Wachtmeister"
                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[#0E2A47]">Christian Wachtmeister</h3>
                            <p className="text-sm text-gmrt-salmon font-semibold uppercase tracking-wide mb-2">GMRT München</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Led Asian operations of a tech company for 15 years. Leads ConLian consultancy for SE Asia & China market entry.
                            </p>
                            <div className="mt-3">
                                <ObfuscatedMail email="muenchen@gmrt.de" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-full text-sm font-medium transition-colors text-slate-600">
                                    <Mail size={16} />
                                    <span>E-Mail schreiben</span>
                                </ObfuscatedMail>
                            </div>
                        </div>

                        {/* Christof Grabner */}
                        <div className="group">
                            <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100">
                                <img
                                    src="/uploads/team/christof-grabner.jpg"
                                    alt="Christof Grabner"
                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[#0E2A47]">Christof Grabner</h3>
                            <p className="text-sm text-gmrt-salmon font-semibold uppercase tracking-wide mb-2">GMRT Wien</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Investment banker and M&A advisor. CEO of GRA:FIN. 30+ years international experience.
                            </p>
                            <div className="mt-3">
                                <ObfuscatedMail email="wien@gmrt.de" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-full text-sm font-medium transition-colors text-slate-600">
                                    <Mail size={16} />
                                    <span>E-Mail schreiben</span>
                                </ObfuscatedMail>
                            </div>
                        </div>

                        {/* Hanns-Robert Mayer */}
                        <div className="group">
                            <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100">
                                <img
                                    src="/uploads/team/hanns-robert-mayer.jpg"
                                    alt="Hanns-Robert Mayer"
                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[#0E2A47]">Hanns-Robert Mayer</h3>
                            <p className="text-sm text-gmrt-salmon font-semibold uppercase tracking-wide mb-2">GMRT Stuttgart</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Gründer und GF der Kontaktwerk GmbH. Langjährige Erfahrung in Unternehmerverbänden und Maschinenbau.
                            </p>
                            <div className="mt-3">
                                <ObfuscatedMail email="stuttgart@gmrt.de" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-full text-sm font-medium transition-colors text-slate-600">
                                    <Mail size={16} />
                                    <span>E-Mail schreiben</span>
                                </ObfuscatedMail>
                            </div>
                        </div>

                        {/* Michael Fisahn-Reinhard */}
                        <div className="group">
                            <div className="overflow-hidden rounded-2xl mb-4 bg-slate-100">
                                <img
                                    src="/uploads/team/michael-fisahn-reinhard.jpg"
                                    alt="Michael Fisahn-Reinhard"
                                    className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-[#0E2A47]">Michael Fisahn-Reinhard</h3>
                            <p className="text-sm text-gmrt-salmon font-semibold uppercase tracking-wide mb-2">GMRT Hamburg</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                International sales and marketing entrepreneur. 25 years experience in market development.
                            </p>
                            <div className="mt-3">
                                <ObfuscatedMail email="hamburg@gmrt.de" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-gmrt-salmon hover:text-white rounded-full text-sm font-medium transition-colors text-slate-600">
                                    <Mail size={16} />
                                    <span>E-Mail schreiben</span>
                                </ObfuscatedMail>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
