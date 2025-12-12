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
                                    group relative w-full overflow-hidden cursor-pointer bg-slate-100
                                    transition-[height] duration-500 ease-in-out
                                    lg:h-[500px] 
                                    ${isMobileActive ? 'h-[500px]' : 'h-24'}
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

                                {/* 
                                    Overlay Logic:
                                    - Desktop Default: Transparent (Gradient at bottom for text)
                                    - Desktop Hover: White 95%
                                    - Mobile Inactive: Transparent (Gradient at bottom)
                                    - Mobile Active: White 95%
                                */}
                                <div className={`
                                    absolute inset-0 bg-white/95 transition-opacity duration-300
                                    lg:opacity-0 lg:group-hover:opacity-100
                                    ${isMobileActive ? 'opacity-100' : 'opacity-0'}
                                `} />

                                {/* Dark Gradient for Inactive State Visibility */}
                                <div className={`
                                    absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 pointer-events-none
                                    lg:opacity-100 lg:group-hover:opacity-0
                                    ${isMobileActive ? 'opacity-0' : 'opacity-100'}
                                `} />

                                {/* Content Container */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end">

                                    {/* Header Row */}
                                    <div className="flex items-center justify-between w-full mb-2 z-10">
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

                                    {/* Description (desktop hover / mobile active) */}
                                    <div className={`
                                        overflow-hidden transition-all duration-500 ease-out z-10
                                        lg:max-h-0 lg:group-hover:max-h-[300px] lg:opacity-0 lg:group-hover:opacity-100
                                        ${isMobileActive ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}
                                    `}>
                                        <div className="w-12 h-1 bg-gmrt-salmon mb-4" />
                                        <p className="text-slate-600 leading-relaxed font-normal">
                                            {item.description}
                                        </p>
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
