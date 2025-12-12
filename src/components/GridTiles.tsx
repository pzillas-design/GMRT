import React from 'react';
import {
    Coins,
    Lightbulb,
    Users,
    ArrowLeftRight,
    Building2,
    Microscope,
    Globe,
    Landmark
} from 'lucide-react';

interface GridTilesProps {
    dict: any;
}

export const GridTiles: React.FC<GridTilesProps> = ({ dict }) => {
    // Icons formatted to match the 8 specific items
    const icons = [
        <Coins size={36} key="inv" />,          // Investition
        <Lightbulb size={36} key="vis" />,      // Visionen
        <Users size={36} key="pers" />,         // Personal
        <ArrowLeftRight size={36} key="trade" />, // Handel
        <Building2 size={36} key="inst" />,     // Institutionen
        <Microscope size={36} key="res" />,     // Forschung
        <Globe size={36} key="asean" />,        // ASEAN
        <Landmark size={36} key="gov" />        // Behörde
    ];

    const items = dict?.impact?.items || [];

    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        {dict?.impact?.title || "Malaysia erfahren, mehr erreichen"}
                    </h2>
                    <p className="text-xl text-slate-400 font-light">
                        {dict?.impact?.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 hover:border-gmrt-salmon/50 transition-all duration-300 group"
                        >
                            <div className="mb-6 text-gmrt-salmon group-hover:scale-110 transition-transform duration-300 origin-left">
                                {icons[index % icons.length]}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-gmrt-salmon transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
