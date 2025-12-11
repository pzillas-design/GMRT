import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { InfoAccordion } from './components/InfoAccordion';
import { EventList } from './components/EventList';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <EventList />
        <InfoAccordion />
      </main>
      <Footer />
    </div>
  );
}

export default App;