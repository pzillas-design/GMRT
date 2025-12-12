import React from 'react';
import Image from 'next/image';

interface GridTilesProps {
    dict: any;
}

export const GridTiles: React.FC<GridTilesProps> = ({ dict }) => {
    const items = dict?.impact?.items || [];

    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gmrt-blue mb-4">
                        {dict?.impact?.title || "Malaysia erfahren, mehr erreichen"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="group relative h-[400px] overflow-hidden rounded-xl bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Gradient Overlay - darker on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full transition-all duration-500">
                                {/* Title - moves up on hover */}
                                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gmrt-salmon transition-colors">
                                        {item.title}
                                    </h3>
                                    {/* Line separator */}
                                    <div className="w-12 h-1 bg-gmrt-salmon mb-4 transition-all duration-500 group-hover:w-full opacity-80" />
                                </div>

                                {/* Description - revealed on hover */}
                                <div className="overflow-hidden transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-[300px] group-hover:opacity-100">
                                    <p className="text-slate-200 text-sm leading-relaxed pb-2">
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
