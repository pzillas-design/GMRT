'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';

interface GridTilesProps {
    dict: any;
}

export const GridTiles: React.FC<GridTilesProps> = ({ dict }) => {
    const items = dict?.impact?.items || [];
    const [activeIndex, setActiveIndex] = useState<number | null>(0); // Default open first one

    return (

        <section className="py-24 bg-white text-gmrt-blue overflow-hidden">
            {/* Light background for fresh look */}
            <div className="max-w-[1600px] mx-auto px-4">

                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-gmrt-blue mb-6">
                        {dict?.impact?.title || "Malaysia erfahren, mehr erreichen"}
                    </h2>
                    {dict?.impact?.subtitle && (
                        <p className="text-slate-600 text-xl font-light leading-relaxed">
                            {dict.impact.subtitle}
                        </p>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row h-auto lg:h-[600px] gap-2 lg:gap-1">
                    {items.map((item: any, index: number) => {
                        const isActive = activeIndex === index;

                        return (
                            <div
                                key={index}
                                onClick={() => setActiveIndex(isActive ? null : index)}
                                className={`
                                    relative overflow-hidden cursor-pointer transition-all duration-500 ease-out
                                    lg:h-full
                                    ${isActive
                                        ? 'lg:flex-[3.5] h-[500px]'
                                        : 'lg:flex-1 h-24 lg:h-full'
                                    }
                                    rounded-2xl lg:rounded-none lg:first:rounded-l-2xl lg:last:rounded-r-2xl
                                    bg-slate-100 border-b border-white lg:border-0 lg:border-l lg:border-white
                                `}
                            >
                                {/* Background Image */}
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className={`object-cover transition-all duration-700 ${isActive ? 'scale-100 grayscale-0 opacity-100' : 'scale-110 grayscale opacity-80'}`}
                                />

                                {/* Light Mode Overlay - White gradient for readability of dark text */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-95' : 'opacity-80'}`} />

                                {/* Content Wrapper */}
                                <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-10 transition-all duration-500`}>

                                    {/* Icon */}
                                    <div className={`absolute top-6 right-6 transition-all duration-500 ${isActive ? 'rotate-45 opacity-100' : 'rotate-0 opacity-50'}`}>
                                        <Plus className="text-gmrt-blue" />
                                    </div>

                                    {/* Text Container */}
                                    <div className={`transform transition-all duration-500 ${isActive ? 'translate-y-0' : 'translate-y-4'}`}>
                                        <div className="w-full pr-4 md:pr-16">
                                            <h3 className={`text-xl md:text-3xl font-bold text-gmrt-blue mb-4 ${isActive ? 'whitespace-normal' : 'whitespace-nowrap'} ${!isActive && 'lg:rotate-[-90deg] lg:origin-bottom-left lg:absolute lg:bottom-10 lg:left-6 lg:mb-0'}`}>
                                                {item.title}
                                            </h3>

                                            <div className={`
                                                overflow-hidden transition-all duration-700 ease-in-out
                                                ${isActive ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}
                                            `}>
                                                <p className="text-slate-600 text-sm md:text-lg leading-relaxed max-w-xl whitespace-normal">
                                                    {item.description}
                                                </p>
                                            </div>
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
