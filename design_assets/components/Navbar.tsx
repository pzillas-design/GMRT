import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Home', href: '#' },
  { label: 'Über uns', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'News', href: '#news' },
  { label: 'Kontakt', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-500 py-6 ${isScrolled ? 'bg-gmrt-blue/95 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center">
          
          {/* Logo - SVG Icon + Text */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-3 group">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 979 1024" 
                className="h-20 w-auto transition-transform duration-300 group-hover:scale-105"
              >
                <path 
                  fill="#F29985" 
                  d="M511 68a594 594 0 0 1 62 3 360 360 0 0 1 15 1l16 2c72 15 138 46 187 100l24 26c9 11 16 23 24 35 6 13 23 42 24 57l-3 3c-12 9-21 13-37 12-20-3-29-29-39-44a338 338 0 0 0-257-158 417 417 0 0 0-369 177c-33 52-54 105-62 166-29 210 149 375 353 366 65-2 136-28 190-64l9-5c24-17 48-35 70-57a425 425 0 0 0 47-57l12-20c11-18 22-31 24-53-1-1-3-4-5-4-13-3-27 5-38 9-28 9-55 21-82 33l-36 19-39 16-21 11c-13 5-33 10-46 5-12-4-24-17-29-29-15-40 22-91 45-122 10-12 25-28 33-42v-4c-3-2-6-2-9-2-8 4-26 22-34 29-32 30-63 61-94 93l-28 32-30 32c-8 8-22 22-34 22-2 0-3-2-5-4-4-6-15-24-14-31 2-20 55-82 69-101l17-23 7-12c11-14 34-40 36-56 1-4 1-9-2-12l-4-1c-9-1-21 12-27 17l-34 30c-21 21-40 45-59 68l-44 50-33 47-11 15-16 15-4 2c-6 1-12-1-17-5-6-4-9-12-10-20s-1-14 2-21c6-11 15-19 23-29l25-32c15-18 28-37 42-56l14-18c5-7 26-40 24-49 0-3-2-6-5-8-2-2-5-1-8 0-6 1-12 5-18 7l-41 23-34 19c-15 9-36 26-53 29l-3-1c-3-3-6-10-6-14-1-13 14-30 23-39 3-4 7-6 11-9 10-5 22-7 32-12 24-11 46-25 71-34 10-3 21-6 32-6 9 0 17 1 24 8 20 19-5 55-10 77-1 5-2 9-1 14 15-8 26-21 37-34l23-18c23-25 50-53 81-67 14-7 34-5 40 11 7 21-19 54-30 71l-15 28c-2 3-5 11-1 13 12-3 30-24 38-33l16-16 38-32c22-17 79-70 106-70 10 0 21 9 27 16 4 4 7 9 5 15-4 10-16 18-23 26l-9 11-23 25-15 20c-6 7-13 14-18 22-10 13-20 29-27 44l-8 19c-6 13-13 23-13 38l1 6c10 0 40-17 50-22l60-27c19-9 39-18 59-25l23-7c11-3 24-7 36-7a68 68 0 0 1 71 68c2 56-66 143-103 183-17 17-34 32-53 47l-17 13-14 8-17 11-37 21-45 18-33 11c-26 8-70 15-97 16h-40c-16-1-33-4-49-7-12-3-25-4-37-8a392 392 0 0 1-233-175c-20-33-37-80-44-118l-3-21a422 422 0 0 1 193-407l17-12c15-9 30-16 46-23l18-10 42-15 31-10c36-10 73-12 110-13" 
                />
              </svg>
              <span className="font-display font-medium text-3xl text-white tracking-wide mt-1">
                GMRT
              </span>
            </a>
          </div>

          {/* Desktop Menu - Simple Links - Larger Font */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/90 hover:text-white text-lg font-normal tracking-wide transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Icons / Actions */}
          <div className="hidden md:flex items-center space-x-6 text-white/90">
             <button className="text-lg font-light hover:text-white flex items-center gap-1">
               <Globe size={20} /> <span>DE</span>
             </button>
             <button className="text-lg font-light hover:text-white flex items-center gap-1">
               <span>Login</span>
             </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gmrt-salmon transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-gmrt-blue border-t border-white/10 py-6 px-6 md:hidden shadow-xl">
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white text-2xl font-light"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};