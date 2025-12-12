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
                            className="group relative h-80 overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-gmrt-salmon transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-200 font-light leading-relaxed transform translate-y-2 opacity-90 group-hover:translate-y-0 transition-transform duration-300">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
