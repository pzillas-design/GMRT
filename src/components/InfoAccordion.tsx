"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AccordionItem } from '../types';

const items: AccordionItem[] = [
    {
        id: 'invest',
        title: 'Investitionen',
        content: 'Malaysia und Deutschland/Österreich bieten Ihnen ein immenses Investitions- und Handelspotenzial. Wir klären Fragen wie: An welche malaysischen Behörden müssen Sie sich wenden? Wo sitzen die wichtigen Kontakte? Welche deutschen Verbände unterstützen Sie mit gezielten Förderprogrammen?'
    },
    {
        id: 'visions',
        title: 'Visionen',
        content: 'Welche Mechanismen und Maßnahmen gibt es im asiatischen Wirtschaftsraum ASEAN in den Bereichen Energie und Umwelttechnik? Wie können deutsche Unternehmen ihre Expertise besonders wettbewerbsstark in Südostasien einsetzen? Beim GMRT stellen erfolgreiche Unternehmer ihre Strategien vor.'
    },
    {
        id: 'personal',
        title: 'Personal',
        content: 'Aufgrund der engen wirtschaftlichen Beziehungen arbeiten viele malaysische Manager als Expatriates hier. Das tiefgreifende Wissen, das sie mitbringen, können Sie sich beim GMRT zunutze machen. Zudem studieren in Deutschland circa 200 malaysische Studenten.'
    },
    {
        id: 'trade',
        title: 'Handel',
        content: 'Als drittstärkstes ASEAN-Land ist Malaysia ein wirtschaftlich hochinteressanter Partner. Deutschland ist Malaysias wichtigster Handelspartner in der EU. Erfahren Sie beim GMRT wichtige Hintergrundfakten zu Importbestimmungen und den Anforderungen vor Ort.'
    },
    {
        id: 'institutions',
        title: 'Institutionen',
        content: 'Industrieverbände, internationale Handelskammern und Wirtschaftsinstitutionen sind starke Partner für erfolgreiche Engagements im Ausland. Bei uns halten zentrale Ansprechpartner dieser Institutionen Vorträge.'
    }
];

export const InfoAccordion: React.FC = () => {
    const [openId, setOpenId] = useState<string | null>('invest');

    const toggle = (id: string) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <section className="py-24 bg-white" id="expertise">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-20">

                <div className="lg:w-1/3">
                    <h2 className="text-4xl md:text-5xl font-bold text-gmrt-blue mb-8 leading-tight">Expertise</h2>
                    <p className="text-slate-600 text-lg font-light leading-relaxed">
                        Der GMRT ist Ihre Wissensplattform. Wir decken alle relevanten Bereiche ab, die für einen erfolgreichen Markteintritt oder die Expansion in Malaysia und dem ASEAN-Raum entscheidend sind.
                    </p>
                </div>

                <div className="lg:w-2/3">
                    <div className="divide-y divide-slate-200">
                        {items.map((item) => (
                            <div key={item.id} className="py-6">
                                <button
                                    onClick={() => toggle(item.id)}
                                    aria-expanded={openId === item.id}
                                    aria-controls={`accordion-content-${item.id}`}
                                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                                >
                                    <span className={`text-2xl font-bold transition-colors ${openId === item.id ? 'text-gmrt-salmon' : 'text-gmrt-blue group-hover:text-gmrt-salmon'}`}>
                                        {item.title}
                                    </span>
                                    {openId === item.id ? <ChevronUp className="text-gmrt-salmon" /> : <ChevronDown className="text-slate-400 group-hover:text-gmrt-salmon" />}
                                </button>

                                <div
                                    id={`accordion-content-${item.id}`}
                                    role="region"
                                    aria-labelledby={`accordion-heading-${item.id}`} // We should ideally add id to the button or heading
                                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openId === item.id ? 'max-h-60 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
                                        }`}
                                >
                                    <p className="text-slate-600 text-lg font-light leading-relaxed max-w-3xl">
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};
