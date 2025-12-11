import React from 'react';
import { Users, Globe2, Briefcase } from 'lucide-react';
import Image from 'next/image';

interface FeaturesProps {
    dict?: any;
}

export const Features: React.FC<FeaturesProps> = ({ dict }) => {
    // Icons mapping
    const icons = {
        network: <Users size={32} className="text-gmrt-blue" />,
        events: <Newspaper size={32} className="text-gmrt-blue" />,
        updates: <MapPin size={32} className="text-gmrt-blue" /> // Using MapPin for 'standorte' if it maps to 'updates' logic?
        // Wait, the dictionary has `network`, `events`, `updates`. The previous hardcoded list had 'Über uns' (Users), 'Neuigkeiten' (Newspaper), 'Standorte' (MapPin).
        // Let's align dict keys with the design or vice versa.
        // dict keys: network, events, updates.
        // previous keys implied: about, news, locations.
    };

    // Construct features list from dict
    const featureList = [
        {
            title: dict?.features?.network?.title || 'Über uns',
            description: dict?.features?.network?.description || '...',
            icon: <Users size={32} className="text-gmrt-blue" />
        },
        {
            title: dict?.features?.events?.title || 'Neuigkeiten',
            description: dict?.features?.events?.description || '...',
            icon: <Newspaper size={32} className="text-gmrt-blue" />
        },
        {
            title: dict?.features?.updates?.title || 'Standorte',
            description: dict?.features?.updates?.description || '...',
            icon: <MapPin size={32} className="text-gmrt-blue" />
        }
    ];

    return (
        <section id="about" className="py-24 bg-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">

                {/* Simple Blocks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
                    {featureList.map((feature, index) => (
                        <div key={index} className="flex flex-col items-start text-left">
                            <div className="mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-gmrt-blue mb-4">{feature.title}</h3>
                            <p className="text-slate-600 text-lg font-light leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-slate-200 my-24"></div>

                {/* Content Section - 50/50 Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gmrt-blue mb-8 leading-tight">
                            {dict?.expertise?.title || 'Synergien für den Erfolg in ASEAN'}
                        </h2>
                        <p className="text-slate-600 text-lg font-light leading-relaxed mb-6">
                            {dict?.expertise?.lead || 'Ehrenamtlich und privat organisiert schaffen unsere Chapter Initiators, Sprecher und Teilnehmenden auf lokaler Ebene wertvolle Synergien für den Austausch zwischen Deutschland und der ASEAN-Region.'}
                        </p>
                        <p className="text-slate-600 text-lg font-light leading-relaxed">
                            {dict?.expertise?.text || 'Ob Expatriates, Unternehmer, Investoren, Wissenschaftler oder Regierungsvertreter – unsere Community lebt von der Vielfalt ihrer Perspektiven.'}
                        </p>
                    </div>
                    <div className="relative h-[600px] bg-slate-100">
                        <img
                            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop"
                            alt="GMRT Meeting"
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
};
