import React from 'react';
import Image from 'next/image';

interface GridTilesProps {
    dict: any;
}

export const GridTiles: React.FC<GridTilesProps> = ({ dict }) => {
    const items = dict?.impact?.items || [];

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
                    {items.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="group relative h-[400px] md:h-[500px] w-full overflow-hidden bg-slate-900 cursor-pointer"
                        >
                            {/* Image Background */}
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            />

                            {/* Default Overlay (Gradient) - Always visible but subtle */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 transition-opacity duration-500" />

                            {/* Hover Overlay - Darker for text readability */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]" />

                            {/* Content Container */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                {/* Title Area */}
                                <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                        {item.title}
                                    </h3>
                                    {/* Animated Underline */}
                                    <div className="w-12 h-1 bg-gmrt-salmon transition-all duration-500 group-hover:w-24 group-hover:bg-white" />
                                </div>

                                {/* Hidden Description Area */}
                                <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-[300px] group-hover:opacity-100 transition-all duration-700 ease-in-out delay-75">
                                    <p className="text-white/90 text-base md:text-lg leading-relaxed pt-4 font-light drop-shadow-md">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
