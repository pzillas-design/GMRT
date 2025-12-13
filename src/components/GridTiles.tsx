'use client';

import React, { useState } from 'react';
import Image from 'next/image';



interface GridTilesProps {
    dict: Record<string, any>;
}

export const GridTiles: React.FC<GridTilesProps> = ({ dict }) => {
    const items = dict?.impact?.items || [];
    const [activeIndex, setActiveIndex] = useState<number | null>(0); // Default open first one

    return (

        <section className="pt-24 pb-0 bg-gmrt-blue text-white overflow-hidden">
            {/* Dark background (Footer Blue) */}

            <div className="max-w-[1600px] mx-auto px-4 mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    {dict?.impact?.title || "Malaysia erfahren, mehr erreichen"}
                </h2>
                {dict?.impact?.subtitle && (
                    <p className="text-slate-300 text-xl font-light leading-relaxed">
                        {dict.impact.subtitle}
                    </p>
                )}
            </div>

            {/* Full Width Grid - No Gaps, No Borders, Edge-to-Edge */}
            <div className="w-full h-auto lg:h-[600px]">
                <div className="flex flex-col lg:flex-row h-full w-full gap-0">
                    {items.map((item: { image: string; title: string; description: string }, index: number) => {
                        const isActive = activeIndex === index;

                        return (
                            <div
                                key={index}
                                onClick={() => setActiveIndex(isActive ? null : index)}
                                className={`
                                    relative overflow-hidden cursor-pointer transition-all duration-500 ease-out
                                    lg:h-full
                                    ${isActive
                                        ? 'lg:flex-[3.5] h-[350px]'
                                        : 'lg:flex-1 h-24 lg:h-full'
                                    }
                                    bg-gmrt-blue
                                    group
                                `}
                            >
                                {/* Background Image */}
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className={`object-cover transition-all duration-700 ${isActive ? 'scale-100 opacity-60' : 'scale-110 opacity-40'}`}
                                />

                                {/* Overlay: Dark gradient for readability */}
                                <div className={`absolute inset-0 transition-all duration-500 
                                    ${isActive
                                        ? 'bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-100'
                                        : 'bg-black/50 group-hover:bg-black/30'
                                    }`}
                                />

                                {/* Content Wrapper */}
                                <div className="absolute inset-0 pointer-events-none">

                                    {/* 1. Collapsed Label (Centered) - Fades Out */}
                                    <div className={`
                                        absolute inset-0 flex items-center justify-center pb-0 lg:items-end lg:pb-12
                                        transition-opacity duration-500 ease-in-out
                                        ${isActive ? 'opacity-0 duration-200' : 'opacity-100 delay-200'}
                                    `}>
                                        <h3 className="text-2xl font-semibold text-white tracking-wide whitespace-nowrap lg:-rotate-90 origin-center lg:translate-y-[-1rem]">
                                            {item.title}
                                        </h3>
                                    </div>

                                    {/* 2. Expanded Content (Title + Description) - Fades In */}
                                    <div className={`
                                        absolute inset-0 p-8 md:p-12 flex flex-col justify-end
                                        ease-in-out
                                        ${isActive ? 'transition-opacity duration-700 delay-300 opacity-100' : 'transition-opacity duration-500 opacity-0'}
                                    `}>
                                        <div className="w-full">
                                            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-200 text-lg md:text-xl leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
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
