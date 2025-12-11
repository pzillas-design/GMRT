import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ObfuscatedMail } from '@/components/ObfuscatedMail';
import { getDictionary } from '@/get-dictionary';

export default async function ImpressumPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict: any = await getDictionary(lang as 'de' | 'en');

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 text-slate-900">
            <div className="max-w-3xl mx-auto px-6 md:px-12">
                <Link href={`/${lang}`} className="inline-flex items-center text-gmrt-blue hover:text-gmrt-salmon transition-colors mb-8 group">
                    <ArrowLeft size={20} className="mr-2 transition-transform group-hover:-translate-x-1" /> {dict.impressum.back_home}
                </Link>

                <h1 className="text-4xl font-bold text-gmrt-blue mb-12">{dict.impressum.title}</h1>

                <div className="space-y-8 text-slate-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">{dict.impressum.tmg}</h2>
                        <p>
                            Intercultural Stepping Stones<br />
                            Hofäckerstraße 28<br />
                            65207 Wiesbaden
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">{dict.impressum.represented_by}</h2>
                        <p>Herr Paramsothy Thamotharampillai-Göbel</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">{dict.impressum.contact}</h2>
                        <div className="space-y-1">
                            <p>Telefon: <span className="select-all">+49 (0) 176 31 29 31 65</span></p>
                            <p>Fax: +49 (0) 6217 96 59 68</p>
                            <div className="flex items-center gap-2">
                                <span>{dict.contact.email_title}:</span>
                                <ObfuscatedMail email="frankfurt@gmrt.de" className="text-gmrt-salmon hover:underline" />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">{dict.impressum.responsible}</h2>
                        <p>
                            Herr Paramsothy Thamotharampillai-Göbel<br />
                            Hofäckerstraße 28<br />
                            65207 Wiesbaden
                        </p>
                    </section>

                    <section className="pt-8 border-t border-slate-200">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">{dict.impressum.disclaimer_title}</h2>

                        <h3 className="font-semibold mb-2">{dict.impressum.liability_content}</h3>
                        <p className="mb-4">
                            {dict.impressum.liability_content_text}
                        </p>

                        <h3 className="font-semibold mb-2">{dict.impressum.liability_links}</h3>
                        <p className="mb-4">
                            {dict.impressum.liability_links_text}
                        </p>

                        <h3 className="font-semibold mb-2">{dict.impressum.copyright}</h3>
                        <p>
                            {dict.impressum.copyright_text}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
