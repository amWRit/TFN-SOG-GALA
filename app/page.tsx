import React from 'react';
import Navbar from '../components/navbar';
import Hero from '../components/hero';
import Stats from '../components/stats';
import Highlights from '../components/highlights';
import CTA from '../components/cta';

const TeachForNepalHomepage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white antialiased">
      <Navbar />
      <Hero />
      <Stats />
      <Highlights />
      <CTA />
    </div>
  );
};

export default TeachForNepalHomepage;
