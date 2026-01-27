"use client";

import React, { useState } from 'react';
import { ChevronRight, Play, Armchair } from 'lucide-react';
import CountdownTimer from './countdown-timer';

const VideoHero = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden" id="home">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-gray-900/80 to-pink-900/90 z-10" />
      <div className="absolute inset-0 bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop" 
          alt="Nepal Education"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            Gala <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">2026</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-200 font-light">
            Empowering Nepal's Future
          </p>

          <div className="py-8">
            <CountdownTimer targetDate="2026-12-31T18:00:00" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setShowVideo(true)}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <Play className="w-5 h-5" />
              Watch 2025 Highlights
            </button>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => window.location.href = '/seating'}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <Armchair className="w-5 h-5" />
              View Available Seats
            </button>
          </div>
        </div>
      </div>

      {showVideo && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-6xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl"
            >
              ✕ Close
            </button>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/u1OCCza-Nl0?autoplay=1"
              title="Gala 2025 Highlights"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoHero;
