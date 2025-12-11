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
                imageSrc="/uploads/contact-hero.png"
            />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-20">
                <div className="max-w-4xl mx-auto">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Address */}
                        <div className="flex items-start gap-6 p-8 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="p-4 bg-white rounded-xl text-gmrt-blue shadow-sm shrink-0">
                                <MapPin size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{dict.contact.address_title}</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    Intercultural Stepping Stones<br />
                                    Hofäckerstraße 28<br />
                                    65207 Wiesbaden
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-6 p-8 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="p-4 bg-white rounded-xl text-gmrt-blue shadow-sm shrink-0">
                                <Mail size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-3">{dict.contact.email_title}</h3>
                                <ObfuscatedMail
                                    email="frankfurt@gmrt.de"
                                    className="text-xl font-medium text-gmrt-salmon hover:text-gmrt-blue transition-colors block mb-2"
                                />
                                <p className="text-sm text-slate-400">
                                    {dict.contact.response_time}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
