import Image from 'next/image';
import { Container } from '@/components/ui/Container';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    imageSrc: string;
}

export const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, imageSrc }) => {
    return (
        <div className="relative h-[600px] w-full flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 w-full pt-24">
                <Container size="xl">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </Container>
            </div>
        </div>
    );
};
