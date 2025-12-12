import React from 'react';
import { Users, Globe2, Briefcase, Newspaper, MapPin, Info } from 'lucide-react';
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
            icon: <Info size={32} className="text-gmrt-blue" />
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
            </div>
        </section>
    );
};
