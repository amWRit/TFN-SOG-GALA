"use client";

import { X } from "lucide-react";

interface AuctionDescModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

export function AuctionDescModal({ title, description, onClose }: AuctionDescModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#dadfe1] rounded-2xl w-full max-w-lg relative shadow-2xl border border-[#1f365f]/20 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-[#d13239] shrink-0" />

        <div className="p-8 overflow-y-auto">
          {/* Close button */}
          <button
            className="absolute top-5 right-5 text-[#1f365f]/50 hover:text-[#1f365f] transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Title */}
          <div className="text-2xl font-bold text-[#1f365f] mb-5 leading-snug pr-8 text-center">
            {title}
          </div>

          {/* Divider */}
          <div className="w-12 h-1 bg-[#d13239] rounded-full mx-auto mb-5" />

          {/* Description */}
          <div className="text-[#1f365f]/80 whitespace-pre-line text-base leading-relaxed break-words">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
