import React from 'react';
import { Users, Newspaper, MapPin, Target, ShieldCheck, Building2 } from 'lucide-react';
import { FeatureItem } from '../types';

const features: FeatureItem[] = [
  {
    title: 'Über uns',
    description: 'Wir engagieren uns aktiv für den bilateralen Wissens- und Erfahrungsaustausch, um Handel und Investitionen langfristig zu stärken.',
    icon: <Users size={32} className="text-gmrt-blue" />,
  },
  {
    title: 'Neuigkeiten',
    description: 'Austausch über aktuelle Marktentwicklungen, regulatorische Rahmenbedingungen und innovative Geschäftsideen im ASEAN-Raum.',
    icon: <Newspaper size={32} className="text-gmrt-blue" />,
  },
  {
    title: 'Standorte',
    description: 'Chapters in Berlin, Düsseldorf, Frankfurt, Hamburg, München, Stuttgart und Wien mit renommierten Referenten vor Ort.',
    icon: <MapPin size={32} className="text-gmrt-blue" />,
  },
];

export const Features: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Simple Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start text-left">
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gmrt-blue mb-4">{feature.title}</h3>
              <p className="text-slate-600 text-lg font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-slate-200 my-24"></div>

        {/* Content Section - 50/50 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="text-4xl md:text-5xl font-bold text-gmrt-blue mb-8 leading-tight">
               Synergien für den Erfolg in ASEAN
             </h2>
             <p className="text-slate-600 text-lg font-light leading-relaxed mb-6">
              Ehrenamtlich und privat organisiert schaffen unsere Chapter Initiators, Sprecher und Teilnehmenden auf lokaler Ebene wertvolle Synergien für den Austausch zwischen Deutschland und der ASEAN-Region.
            </p>
             <p className="text-slate-600 text-lg font-light leading-relaxed">
              Ob Expatriates, Unternehmer, Investoren, Wissenschaftler oder Regierungsvertreter – unsere Community lebt von der Vielfalt ihrer Perspektiven.
            </p>
          </div>
          <div className="relative h-[600px] bg-slate-100">
             <img 
               src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop" 
               alt="GMRT Meeting" 
               className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
             />
          </div>
        </div>

      </div>
    </section>
  );
};