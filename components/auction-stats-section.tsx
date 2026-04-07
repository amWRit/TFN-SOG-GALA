"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AuctionStatsSectionProps {
  isClosed: boolean;
  actualPrice: number;
  soldPrice: number;
  currentBid: number;
  startingBid: number;
  currentBidder: string | null;
}

export function AuctionStatsSection({
  isClosed,
  actualPrice,
  soldPrice,
  currentBid,
  startingBid,
  currentBidder,
}: AuctionStatsSectionProps) {
  const [statsOpen, setStatsOpen] = useState(false);
  return (
    <div
      className="rounded-2xl border border-[#D4AF37]/40 overflow-hidden backdrop-blur-sm"
      style={{ background: "rgba(8,70,145,0.15)" }}
    >
      {/* Header toggle */}
      <button
        onClick={() => setStatsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
      >
        <span className="font-playfair text-[#D4AF37] font-bold text-lg tracking-wide">
          Item Stats
        </span>
        {statsOpen ? (
          <ChevronUp className="w-5 h-5 text-[#D4AF37]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {statsOpen && (
          <motion.div
            key="stats-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Card 1: Actual Price (active) / Final Bid (closed) */}
                <div
                  className="flex flex-col items-center justify-center rounded-2xl p-5 border border-[#D4AF37]/50"
                  style={{ background: "rgba(212,175,55,0.07)" }}
                >
                  <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/60 mb-3 text-center">
                    {isClosed ? "Final Bid" : "Actual Price"}
                  </span>
                  <span
                    className="font-playfair font-extrabold text-[#D4AF37] text-center leading-tight"
                    style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
                  >
                    {isClosed
                      ? (soldPrice > 0 ? soldPrice : currentBid).toLocaleString()
                      : actualPrice.toLocaleString()}
                  </span>
                  <span className="text-white/40 text-[10px] mt-2">NPR</span>
                </div>

                {/* Card 2: Starting Bid (active) / Final Bidder (closed) */}
                {(!isClosed || (currentBidder && currentBidder !== "NA")) && (
                  <div
                    className="flex flex-col items-center justify-center rounded-2xl p-5 border border-white/15"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/60 mb-3 text-center">
                      {isClosed ? "Final Bidder" : "Starting Bid"}
                    </span>
                    {isClosed ? (
                      <span
                        className="font-playfair font-bold text-white text-center leading-snug"
                        style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", wordBreak: "break-word" }}
                      >
                        {currentBidder}
                      </span>
                    ) : (
                      <>
                        <span
                          className="font-playfair font-extrabold text-white text-center leading-tight"
                          style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
                        >
                          {startingBid.toLocaleString()}
                        </span>
                        <span className="text-white/40 text-[10px] mt-2">NPR</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Status pill */}
              {isClosed ? (
                <div className="px-6 py-2.5 rounded-full bg-gray-700/50 border border-white/20 text-white/70 text-sm font-semibold uppercase tracking-widest text-center mt-6">
                  Bidding Closed
                </div>
              ) : (
                <div className="px-6 py-2.5 rounded-full bg-green-500/20 border border-green-400/40 text-green-300 text-sm font-semibold uppercase tracking-widest text-center mt-6">
                  Bidding Open
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
