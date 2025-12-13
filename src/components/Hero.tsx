import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface HeroProps {
    dict?: any;
    lang?: string;
}

export const Hero: React.FC<HeroProps> = ({ dict, lang = 'de' }) => {
    // Fallback if dict is not provided (though it should be)
    const t = dict?.hero || {
        title: "German Malaysian Round Table",
        subtitle: "Wir bringen Menschen, Ideen und Institutionen aus Deutschland und Malaysia zusammen.",
        cta: "News"
    };

    return (
        <div className="relative h-[55vh] min-h-[450px] md:h-[700px] w-full flex items-center">
            {/* Background Image - Skyline */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1564506414752-a73fbe0c6b00?q=80&w=4332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Kuala Lumpur Skyline"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Subtle overlay to ensure text readability like in reference */}
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            <div className="relative z-10 w-full pt-32 md:pt-40">
                <Container size="xl">
                    <div className="max-w-5xl">
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                            {t.title}
                        </h1>
                        <p className="text-2xl text-white font-light leading-snug mb-8 max-w-3xl">
                            {t.subtitle}
                        </p>

                        <Button
                            href={`/${lang}/news`}
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
