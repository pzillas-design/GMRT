'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface HeroProps {
    dict?: any;
}

const HERO_IMAGES = [
    {
        src: "https://images.unsplash.com/photo-1564506414752-a73fbe0c6b00?q=80&w=4332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Kuala Lumpur Skyline"
    },
    {
        src: "/images/frankfurt.png",
        alt: "Frankfurt Skyline"
    }
];

export const Hero: React.FC<HeroProps> = ({ dict }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fallback dict
    const t = dict?.hero || {
        title: "German Malaysian Round Table",
        subtitle: "Wir bringen Menschen, Ideen und Institutionen aus Deutschland und Malaysia zusammen.",
        cta: "Mehr erfahren"
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        }, 6000); // Switch every 6 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[700px] w-full flex items-center overflow-hidden">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0 select-none">
                {HERO_IMAGES.map((image, index) => (
                    <div
                        key={image.src}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            priority={index === 0} // Only priority load the first one
                        />
                        {/* Overlay per image to ensure consistent readability */}
                        <div className="absolute inset-0 bg-black/30"></div>
                    </div>
                ))}
            </div>

            {/* Content (z-20 to sit above the fading images which go up to z-10) */}
            <div className="relative z-20 w-full pt-10">
                <Container size="xl">
                    <div className="max-w-5xl">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight drop-shadow-sm">
                            {t.title}
                        </h1>
                        <p className="text-2xl text-white font-light leading-snug mb-10 max-w-3xl drop-shadow-sm">
                            {t.subtitle}
                        </p>

                        <Button
                            href="#about"
                            variant="primary"
                            size="lg"
                            className="bg-gmrt-salmon hover:bg-white hover:text-gmrt-blue border-none text-white px-10 py-4 h-auto text-lg"
                        >
                            {t.cta}
                        </Button>
                    </div>
                </Container>
            </div>
        </div>
    );
};
