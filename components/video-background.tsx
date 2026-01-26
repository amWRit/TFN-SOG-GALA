"use client";
import React from "react";


export type VideoBackgroundProps = {
  className?: string;
};

export function VideoBackground({ className = "absolute inset-0 z-0" }: VideoBackgroundProps) {
  return (
    <div className={className}>
      <iframe
        className="w-full h-full object-cover opacity-40"
        src="https://www.youtube.com/embed/u1OCCza-Nl0?autoplay=1&mute=1&loop=1&playlist=u1OCCza-Nl0&controls=0&showinfo=0&modestbranding=1&rel=0"
        title="YouTube video background"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{ pointerEvents: 'none' }}
      />
      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#1a1a1a]/60 to-[#1a1a1a]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5" />
    </div>
  );
}
