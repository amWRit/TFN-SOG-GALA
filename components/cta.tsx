"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 bg-gray-900 w-full">
      <div className="w-full text-center flex flex-col items-center justify-center px-4 sm:px-6">
        <h2 className="text-5xl font-bold text-white mb-6">
          Join Us in Making History
        </h2>
        <p className="text-xl text-gray-400 mb-10">
          Be part of an unforgettable evening supporting Nepal's future leaders
        </p>
        <a
          href="/register"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Reserve Your Seat
          <ChevronRight className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
};

export default CTASection;
