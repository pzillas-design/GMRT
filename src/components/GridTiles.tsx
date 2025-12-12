'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface GridTilesProps {
    dict: any;
}

export const GridTiles: React.FC<GridTilesProps> = ({ dict }) => {
    const items = dict?.impact?.items || [];
    const [activeIndex, setActiveIndex] = useState<number>(0);

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">

                {/* Section Header */}
                <div className="mb-16 md:mb-24 max-w-3xl">
                    <h2 className="text-4xl md:text-6xl font-bold text-gmrt-blue mb-6 leading-tight">
                        {dict?.impact?.title || "Malaysia erfahren, mehr erreichen"}
                    </h2>
                    <p className="text-xl text-slate-500 font-light leading-relaxed">
                        {dict?.impact?.subtitle}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">

                    {/* Left Column: Interactive List */}
                    <div className="lg:w-5/12 flex flex-col gap-2">
                        {items.map((item: any, index: number) => {
                            const isActive = activeIndex === index;
                            return (
                                <div
                                    key={index}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => setActiveIndex(index)} // For touch hybrid handling
                                    className={`
                                        group relative p-6 cursor-pointer rounded-xl transition-all duration-500 border-l-4
                                        ${isActive
                                            ? 'bg-slate-50 border-gmrt-salmon shadow-sm'
                                            : 'bg-transparent border-transparent hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`text-xl md:text-2xl font-bold transition-colors ${isActive ? 'text-gmrt-blue' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                            {item.title}
                                        </h3>
                                        {isActive && <ArrowRight className="text-gmrt-salmon animate-pulse" size={24} />}
                                    </div>

                                    <div className={`
                                        overflow-hidden transition-all duration-500 ease-in-out
                                        ${isActive ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
                                    `}>
                                        <p className="text-slate-600 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Dynamic Image (Sticky) - hidden on mobile, shown on lg */}
                    <div className="hidden lg:block lg:w-7/12 relative">
                        <div className="sticky top-32 h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-100">
                            {items.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-all duration-700 ease-in-out transform
                                        ${activeIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                                    `}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                        sizes="(max-width: 1200px) 50vw, 800px"
                                    />
                                    {/* Subtle Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                                    {/* Floating Label */}
                                    <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg">
                                        <p className="text-gmrt-blue font-bold tracking-widest uppercase text-sm">
                                            {item.title}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Only: Horizontal Scroll Cards */}
                    <div className="lg:hidden w-full flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 no-scrollbar">
                        {items.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="snap-center shrink-0 w-[85vw] h-[400px] relative rounded-2xl overflow-hidden shadow-lg"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 p-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-slate-200 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};
