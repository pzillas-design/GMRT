import React from 'react';

export const Hero: React.FC = () => {
  return (
    <div className="relative h-[700px] w-full flex items-center">
      {/* Background Image - Skyline */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1564506414752-a73fbe0c6b00?q=80&w=4332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Kuala Lumpur Skyline" 
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay to ensure text readability like in reference */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-10">
        <div className="max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
            German Malaysian Round Table
          </h1>
          <p className="text-2xl text-white font-light leading-snug mb-10 max-w-3xl">
            Wir bringen Menschen, Ideen und Institutionen aus Deutschland und Malaysia zusammen – mit dem Ziel, nachhaltige Beziehungen in Wirtschaft, Bildung und Kultur zu fördern.
          </p>
          
          <a 
            href="#about" 
            className="inline-block bg-gmrt-salmon text-white text-lg font-medium px-10 py-4 hover:bg-white hover:text-gmrt-blue transition-colors duration-300"
          >
            Mehr erfahren
          </a>
        </div>
      </div>
    </div>
  );
};