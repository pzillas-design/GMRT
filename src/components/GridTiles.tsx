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
        <section className="py-24 bg-slate-950 text-white overflow-hidden">
            {/* Dark background for contrast/fresh look */}
            <div className="max-w-[1600px] mx-auto px-4">

                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-6">
                        {dict?.impact?.title || "Malaysia erfahren, mehr erreichen"}
                    </h2>
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
                                        : 'lg:flex-1 h-24 lg:h-full' // Mobile: collapsed height needs to be reasonable. h-20 was small.
                                    }
                                    rounded-2xl lg:rounded-none lg:first:rounded-l-2xl lg:last:rounded-r-2xl
                                    bg-slate-900 border-b border-slate-800 lg:border-0
                                `}
                            >
                                {/* Background Image - Dimmed when inactive */}
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className={`object-cover transition-all duration-700 ${isActive ? 'scale-100 opacity-60' : 'scale-110 opacity-30 grayscale'}`}
                                />

                                {/* Overlay Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-80'}`} />

                                {/* Content Wrapper - Fixed width container to prevent text reflow during width transition */}
                                <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-10 transition-all duration-500`}>

                                    {/* Number / Icon */}
                                    <div className={`absolute top-6 right-6 transition-all duration-500 ${isActive ? 'rotate-45 opacity-100' : 'rotate-0 opacity-50'}`}>
                                        <Plus className="text-white" />
                                    </div>

                                    {/* Text Container with fixed minimum width to stabilize layout */}
                                    <div className={`transform transition-all duration-500 ${isActive ? 'translate-y-0' : 'translate-y-4'}`}>
                                        <div className="w-[80vw] md:w-[600px]"> {/* Prevents text wrap jitter */}
                                            <h3 className={`text-xl md:text-3xl font-bold text-white mb-4 whitespace-nowrap ${!isActive && 'lg:rotate-[-90deg] lg:origin-bottom-left lg:absolute lg:bottom-10 lg:left-6 lg:mb-0 lg:whitespace-nowrap'}`}>
                                                {item.title}
                                            </h3>

                                            <div className={`
                                                overflow-hidden transition-all duration-700 ease-in-out
                                                ${isActive ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}
                                            `}>
                                                <p className="text-slate-300 text-sm md:text-lg leading-relaxed max-w-xl whitespace-normal">
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
