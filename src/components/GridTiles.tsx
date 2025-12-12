'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

interface GridTilesProps {
    dict: any;
}

export const GridTiles: React.FC<GridTilesProps> = ({ dict }) => {
    const items = dict?.impact?.items || [];
    const [activeMobileIndex, setActiveMobileIndex] = useState<number>(0);

    return (
        <section className="w-full bg-white">
            <div className="w-full">
                <div className="px-6 md:px-12 py-16 text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-gmrt-blue mb-6">
                        {dict?.impact?.title || "Malaysia erfahren, mehr erreichen"}
                    </h2>
                    <p className="text-xl text-slate-500 font-light leading-relaxed">
                        {dict?.impact?.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 w-full">
                    {items.map((item: any, index: number) => {
                        const isMobileActive = activeMobileIndex === index;

                        return (
                            <div
                                key={index}
                                onClick={() => setActiveMobileIndex(index)}
                                className={`
                                    group relative w-full overflow-hidden cursor-pointer transition-all duration-500 ease-in-out
                                    lg:h-[500px] 
                                    ${isMobileActive ? 'h-[450px]' : 'h-24'}
                                `}
                            >
                                {/* Image Background */}
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 25vw"
                                    className="object-cover transition-transform duration-700 lg:group-hover:scale-105"
                                />

                                {/* Overlay: Light/White Gradient */}
                                {/* Desktop: Show on hover. Mobile: Show if active. */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-transparent
                                    transition-opacity duration-300
                                    lg:opacity-0 lg:group-hover:opacity-100
                                    ${isMobileActive ? 'opacity-100' : 'opacity-0'}
                                `} />

                                {/* Mobile Inactive Title Overlay (Dark text on image? No, needs visibility) 
                                    Actually, for the "inactive" mobile state (h-24), we need a label that is readable.
                                    Let's add a consistent subtle dark gradient for base visibility if inactive, 
                                    which fades out when the white overlay fades in.
                                */}
                                <div className={`
                                    absolute inset-0 bg-black/40 lg:hidden transition-opacity duration-300
                                    ${isMobileActive ? 'opacity-0' : 'opacity-60'}
                                `} />

                                {/* Content Container */}
                                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full">

                                    {/* Header Row (Title + Chevron) */}
                                    <div className="flex items-center justify-between w-full mb-2 transform transition-transform duration-300 lg:translate-y-8 lg:group-hover:translate-y-0">
                                        <h3 className={`
                                            text-2xl font-bold transition-colors duration-300
                                            lg:text-white lg:group-hover:text-gmrt-blue
                                            ${isMobileActive ? 'text-gmrt-blue' : 'text-white'}
                                        `}>
                                            {item.title}
                                        </h3>

                                        <ChevronDown
                                            size={24}
                                            className={`
                                                transition-all duration-300
                                                lg:text-gmrt-blue lg:opacity-0 lg:group-hover:opacity-100
                                                ${isMobileActive ? 'rotate-180 text-gmrt-blue' : 'text-white'}
                                            `}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className={`
                                        overflow-hidden transition-all duration-500 ease-out
                                        lg:max-h-0 lg:group-hover:max-h-[300px] lg:opacity-0 lg:group-hover:opacity-100
                                        ${isMobileActive ? 'max-h-[300px] opacity-100 py-2' : 'max-h-0 opacity-0'}
                                    `}>
                                        <p className="text-slate-600 leading-relaxed font-normal">
                                            {item.description}
                                        </p>
                                        <div className="mt-4 h-1 w-12 bg-gmrt-salmon" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
