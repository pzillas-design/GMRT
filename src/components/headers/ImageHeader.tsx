import Link from 'next/link';
import Image from 'next/image';
import { getPostImage } from '@/lib/blog-utils';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface ImageHeaderProps {
    title: string;
    description?: string; // Optional subtitle/metadata
    backgroundImage?: string;
    backLink?: string;
    backLabel?: string;
    children?: React.ReactNode;
}

export function ImageHeader({
    title,
    description,
    backgroundImage,
    backLink,
    backLabel,
    children
}: ImageHeaderProps) {
    return (
        <div className="relative min-h-[40vh] md:min-h-[60vh] w-full flex items-end pb-10 md:pb-16 pt-32 md:pt-40">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                {backgroundImage && (
                    <Image
                        src={backgroundImage}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                {/* Overlays for readability */}
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-90"></div>
            </div>

            {/* Main Header Content */}
            <div className="relative z-10 w-full px-6 md:px-12 max-w-5xl mx-auto">
                {backLink && (
                    <div className="mb-8">
                        <Link
                            href={backLink}
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                            <span className="font-medium tracking-wide text-sm uppercase">{backLabel || 'Back'}</span>
                        </Link>
                    </div>
                )}

                <div className="mb-6">
                    {children}
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-md">
                    {title}
                </h1>
                {description && (
                    <p className="mt-4 text-xl text-white/90 max-w-2xl font-light leading-relaxed drop-shadow">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
