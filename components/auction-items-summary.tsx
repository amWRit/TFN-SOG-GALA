"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Users, TrendingUp, CheckCircle2, Radio } from "lucide-react";

interface AuctionItem {
  id: string;
  sequence: number;
  title: string;
  patron: string | null;
  actualPrice: number;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  soldPrice: number;
  isActive: boolean;
  endTime: string | null;
  bids: { id: string }[];
}

function isClosed(item: AuctionItem): boolean {
  if (!item.isActive) return true;
  if (item.endTime && new Date(item.endTime).getTime() <= Date.now()) return true;
  return false;
}

export function AuctionItemsSummary() {
  const [items, setItems] = useState<AuctionItem[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchItems() {
      const res = await fetch("/api/auction/items");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    }
    fetchItems();
    interval = setInterval(fetchItems, 5000);
    return () => clearInterval(interval);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="w-full mt-10">
      {/* Section header */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-2">
          Auction Items
        </h2>
        <div className="w-16 h-0.5 bg-[#D4AF37]" />
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {items.map((item, idx) => {
            const closed = isClosed(item);
            const soldTo = item.currentBidder;
            const finalPrice = item.soldPrice > 0 ? item.soldPrice : item.currentBid;
            const bidCount = item.bids?.length ?? 0;
            const lift =
              item.actualPrice > 0 && finalPrice > 0
                ? Math.round((finalPrice / item.actualPrice) * 100)
                : null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className={`rounded-2xl border px-6 py-5 flex flex-col gap-4 ${
                  closed
                    ? "border-white/10 bg-[#101b36]"
                    : "border-[#D4AF37]/30 bg-[#D4AF37]/5"
                }`}
              >
                {/* Top row: sequence + title + status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-10 h-10 rounded-full bg-[#1a2540] flex items-center justify-center text-sm font-bold text-gray-400">
                      {item.sequence}
                    </span>
                    <span className="font-playfair font-bold text-white text-xl md:text-2xl truncate">
                      {item.title}
                    </span>
                  </div>
                  {closed ? (
                    <span className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gray-700/60 text-gray-300 text-sm font-semibold uppercase tracking-wide">
                      <CheckCircle2 className="w-4 h-4" />
                      Closed
                    </span>
                  ) : (
                    <span className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#d71a21]/20 text-red-400 text-sm font-semibold uppercase tracking-wide animate-pulse">
                      <Radio className="w-4 h-4" />
                      Live
                    </span>
                  )}
                </div>

                {/* Patron */}
                {/* {item.patron && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Tag className="w-3.5 h-3.5 shrink-0" />
                    <span>Patron: <span className="text-gray-300 font-medium">{item.patron}</span></span>
                  </div>
                )} */}

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Actual price */}
                  {item.actualPrice > 0 && (
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">Actual Value</span>
                      <span className="font-semibold text-gray-300 text-base md:text-lg">
                        NPR {item.actualPrice.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Starting bid */}
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">Starting Bid</span>
                    <span className="font-semibold text-gray-300 text-base md:text-lg">
                      NPR {item.startingBid.toLocaleString()}
                    </span>
                  </div>

                  {/* Sold / current price */}
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                      {closed ? "Sold Price" : "Current Bid"}
                    </span>
                    <span
                      className={`font-bold text-base md:text-lg ${
                        closed ? "text-yellow-400" : "text-green-400"
                      }`}
                    >
                      {finalPrice > 0
                        ? `NPR ${finalPrice.toLocaleString()}`
                        : "—"}
                    </span>
                  </div>

                  {/* Bid count */}
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-gray-500 mb-1">Bids</span>
                    <span className="flex items-center gap-1.5 font-semibold text-gray-300 text-base md:text-lg">
                      <Users className="w-4 h-4 text-gray-500" />
                      {bidCount}
                    </span>
                  </div>
                </div>

                {/* Sold-to + lift (only when closed and there's a winner) */}
                {closed && soldTo && (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2 text-base md:text-lg">
                      <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />
                      <span className="text-gray-400">Sold to</span>
                      <span className="text-white font-bold">{soldTo}</span>
                    </div>
                    {lift !== null && (
                      <div className="flex items-center gap-2 text-base md:text-lg">
                        <TrendingUp className="w-5 h-5 text-green-400 shrink-0" />
                        <span className="text-green-400 font-bold">{lift}% of value</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Live: current bidder */}
                {!closed && item.currentBidder && (
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-base md:text-lg">
                    <span className="text-gray-400">Leading:</span>
                    <span className="text-white font-bold">{item.currentBidder}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
