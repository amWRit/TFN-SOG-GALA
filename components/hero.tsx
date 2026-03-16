"use client";

import React, { useState } from 'react';
import { ChevronRight, Play, Armchair, Gavel, CalendarCheck, List } from 'lucide-react';
import CountdownTimer from './countdown-timer';

const VideoHero = () => {
  const [showVideo, setShowVideo] = useState(false);
  const targetDate = process.env.NEXT_PUBLIC_GALA_TARGET_DATE || "2026-12-31T18:00:00";

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-24 sm:pt-28" id="home">
      <div className="absolute inset-0 bg-gradient-to-br from-[#084691]/88 via-[#225898]/75 to-[#084691]/88 z-10" />
      <div className="absolute inset-0 bg-gray-900">
        <img 
          // src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop" 
          src = "/images/tfnimage2.jpg"
          alt="Nepal Education"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 w-full">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight break-words max-w-full overflow-x-hidden">
            Gala <span className="text-[#d71a21]">2026</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-200 font-light">
            Empowering Nepal's Future
          </p>

          <div className="py-8 flex justify-center w-full">
            <div className="w-full max-w-xs mx-auto">
              <CountdownTimer targetDate={targetDate} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <button 
              onClick={() => setShowVideo(true)}
              className="group bg-[#d71a21] hover:bg-[#b81519] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer"
            >
              <Play className="w-5 h-5" />
              Watch 2025 Highlights
            </button>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full">
            <button
              onClick={() => window.location.href = '/seating'}
              className="group bg-white/15 hover:bg-white/25 border border-white/50 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer"
            >
              <Armchair className="w-5 h-5" />
              View Available Seats
            </button>
            <button
              onClick={() => window.location.href = '/auction'}
              className="group bg-white/15 hover:bg-white/25 border border-white/50 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer"
            >
              <Gavel className="w-5 h-5" />
              View Auction Items
            </button>
            {/* Mobile-only buttons */}
            <button
              onClick={() => window.location.href = '/program'}
              className="group bg-white/15 hover:bg-white/25 border border-white/50 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 w-full justify-center cursor-pointer sm:hidden"
            >
              <List className="w-5 h-5" />
              View Program
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="group bg-white/15 hover:bg-white/25 border border-white/50 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 w-full justify-center cursor-pointer sm:hidden"
            >
              <CalendarCheck className="w-5 h-5" />
              RSVP
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
