"use client";

import { X } from "lucide-react";

interface AuctionDescModalProps {
  title: string;
  description: string;
  onClose: () => void;
}

// Utility to format description: linkify URLs and bold # lines
function formatDescription(text: string) {
  // Match http(s)://... or www....
  const urlRegex = /(https?:\/\/[\w.-]+(?:\.[\w\.-]+)+(?:[\w\-\._~:/?#[\]@!$&'()*+,;=]+)?|www\.[\w.-]+(?:\.[\w\.-]+)+(?:[\w\-\._~:/?#[\]@!$&'()*+,;=]+)?)/g;
  // Split into lines to handle # bolding
  const lines = text.split(/\r?\n/);
  let keyCounter = 0;
  return lines.map((line, lineIdx) => {
    let content;
    if (line.trim().startsWith('#')) {
      // Remove leading # and whitespace, then linkify the rest and wrap in <b>
      const boldText = line.replace(/^#+\s*/, '');
      const parts = boldText.split(urlRegex);
      content = (
        <b key={keyCounter++} className="font-bold">
          {parts.map((part, i) => {
            if (urlRegex.test(part)) {
              let href = part;
              if (!/^https?:\/\//i.test(href)) {
                href = 'https://' + href;
              }
              return (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#d71a21] break-all"
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </b>
      );
    } else {
      // Normal line, linkify URLs only
      const parts = line.split(urlRegex);
      content = parts.map((part, i) => {
        if (urlRegex.test(part)) {
          let href = part;
          if (!/^https?:\/\//i.test(href)) {
            href = 'https://' + href;
          }
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#d71a21] break-all"
            >
              {part}
            </a>
          );
        }
        return part;
      });
    }
    // Add <br /> after each line except the last
    return (
      <span key={keyCounter++}>
        {content}
        {lineIdx < lines.length - 1 ? <br /> : null}
      </span>
    );
  });
}

export function AuctionDescModal({ title, description, onClose }: AuctionDescModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#dadfe1] rounded-2xl w-full max-w-lg relative shadow-2xl border border-[#084691]/20 overflow-hidden flex flex-col mt-20 mb-20" style={{ maxHeight: 'calc(100vh - 11rem)' }}>
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-[#d71a21] shrink-0" />

        <div className="p-8 overflow-y-auto">
          {/* Close button */}
          <button
            className="absolute top-5 right-5 text-[#084691]/50 hover:text-[#084691] transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Title */}
          <div className="text-2xl font-bold text-[#084691] mb-5 leading-snug pr-8 text-center">
            {title}
          </div>

          {/* Divider */}
          <div className="w-12 h-1 bg-[#d71a21] rounded-full mx-auto mb-5" />

          {/* Description */}
          <div className="text-[#225898] whitespace-pre-line text-base leading-relaxed break-words">
            {formatDescription(description)}
          </div>
        </div>
      </div>
    </div>
  );
}
