import React from 'react';
import { Mail, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ObfuscatedMail } from '@/components/ObfuscatedMail';
import { PageHero } from '@/components/PageHero';
import { getDictionary } from '@/get-dictionary';

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict: any = await getDictionary(lang as 'de' | 'en');

    return (
        <div className="bg-white pb-20">
            <PageHero
                title={dict.contact.title}
                subtitle={dict.contact.subtitle}
                imageSrc="/images/about-hero-hq.jpg"
            />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-16 relative z-10">
                <div className="max-w-4xl mx-auto">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Address Card */}
                        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-gmrt-blue/20 transition-all group">
                            <div className="w-14 h-14 bg-gmrt-blue/5 text-gmrt-blue rounded-xl flex items-center justify-center mb-6 group-hover:bg-gmrt-blue group-hover:text-white transition-colors">
                                <MapPin size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">{dict.contact.address_title}</h3>
                            <p className="text-slate-600 leading-relaxed text-lg font-light">
                                <span className="font-medium text-slate-800">Intercultural Stepping Stones</span><br />
                                Hofäckerstraße 28<br />
                                65207 Wiesbaden
                            </p>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:border-gmrt-salmon/20 transition-all group">
                            <div className="w-14 h-14 bg-gmrt-salmon/5 text-gmrt-salmon rounded-xl flex items-center justify-center mb-6 group-hover:bg-gmrt-salmon group-hover:text-white transition-colors">
                                <Mail size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4">{dict.contact.email_title}</h3>
                            <ObfuscatedMail
                                email="frankfurt@gmrt.de"
                                className="text-xl font-medium text-slate-800 hover:text-gmrt-salmon transition-colors block mb-4 border-b-2 border-gmrt-salmon/20 hover:border-gmrt-salmon inline-block pb-1"
                            />
                            <p className="text-sm text-slate-400 font-medium bg-slate-50 inline-block px-3 py-1 rounded-full">
                                {dict.contact.response_time}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
