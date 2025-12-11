import React from 'react';
import { EventItem } from '../types';

const events: EventItem[] = [
  {
    id: 1,
    date: '14.10.2025',
    title: 'GMRT Düsseldorf',
    category: 'Networking',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    date: '09.10.2025',
    title: 'GMRT Westfalen',
    category: 'Inauguration',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    date: '30.08.2025',
    title: 'Rückblick München',
    category: 'Rückblick',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    date: '20.06.2025',
    title: '30. GMRT Frankfurt',
    category: 'Jubiläum',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop'
  }
];

export const EventList: React.FC = () => {
  return (
    <section id="events" className="py-24 bg-gmrt-gray">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gmrt-blue">Veranstaltungen</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {events.map((event) => (
            <div key={event.id} className="group cursor-pointer">
              <div className="aspect-[4/5] overflow-hidden bg-gray-200 mb-6 relative">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-0 left-0 p-4 w-full flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider">{event.category}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gmrt-salmon uppercase tracking-wide mb-2">
                  {event.date}
                </p>
                <h3 className="text-xl font-bold text-gmrt-blue leading-tight">
                  {event.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
            <a href="#" className="inline-block border-b border-gmrt-blue text-gmrt-blue pb-1 hover:text-gmrt-salmon hover:border-gmrt-salmon transition-colors font-medium">
            Alle Termine ansehen
          </a>
        </div>
      </div>
    </section>
  );
};