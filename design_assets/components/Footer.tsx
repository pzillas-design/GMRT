import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gmrt-blue text-white py-24" id="contact">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          <div className="col-span-1 md:col-span-2">
            <a href="#" className="font-display font-bold text-3xl block mb-8">GMRT</a>
            <p className="text-white/60 text-lg font-light max-w-md leading-relaxed">
              Die unabhängige Plattform für den Austausch zwischen Deutschland und Malaysia. Verbinden Sie sich mit Experten und Entscheidungsträgern.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Menu</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-white/60 hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="text-white/60 hover:text-white transition-colors">Über uns</a></li>
              <li><a href="#events" className="text-white/60 hover:text-white transition-colors">Events</a></li>
              <li><a href="#news" className="text-white/60 hover:text-white transition-colors">News</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Kontakt</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="mailto:info@gmrt.de" className="hover:text-white transition-colors">info@gmrt.de</a></li>
              <li>+49 (0) 123 456 789</li>
              <li className="pt-4 flex gap-4">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between text-sm text-white/40">
          <p>© {new Date().getFullYear()} German Malaysian Round Table.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Impressum</a>
            <a href="#" className="hover:text-white">Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  );
};