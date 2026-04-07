"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, User } from "lucide-react";

interface Bid {
  id: string;
  amount: number;
  bidderName: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}


export function AuctionBidHistory({ itemId }: { itemId: string }) {
  const [bids, setBids] = useState<Bid[]>([]);
  // Collapsed by default
  const [historyOpen, setHistoryOpen] = useState(false);
  const prevBidCountRef = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchBids() {
      const res = await fetch(`/api/admin/auction/items/${itemId}/bids`);
      if (res.ok) {
        const data = await res.json();
        const incoming: Bid[] = data.bids ?? [];
        prevBidCountRef.current = incoming.length;
        setBids(incoming);
      }
    }
    fetchBids();
    interval = setInterval(fetchBids, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12">
      <div
        className="rounded-2xl border border-[#D4AF37]/40 overflow-hidden backdrop-blur-sm"
        style={{ background: "rgba(8,70,145,0.15)" }}
      >
        {/* Header toggle */}
        <button
          onClick={() => setHistoryOpen((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="font-playfair text-[#D4AF37] font-bold text-lg tracking-wide">
              Bid History
            </span>
            {bids.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold">
                {bids.length} bid{bids.length !== 1 ? "s" : ""}
              </span>
            )}
            {bids.length === 0 && (
              <span className="text-white/40 text-sm">No bids yet</span>
            )}
          </div>
          {historyOpen ? (
            <ChevronUp className="w-5 h-5 text-[#D4AF37]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#D4AF37]" />
          )}
        </button>

        {/* Collapsible body */}
        <AnimatePresence initial={false}>
          {historyOpen && (
            <motion.div
              key="bid-history-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="px-4 pb-4 flex flex-col gap-2 overflow-y-auto"
                style={{ maxHeight: "340px" }}
              >
                {bids.length === 0 ? (
                  <p className="text-center text-white/40 py-8 text-sm">
                    Waiting for bids…
                  </p>
                ) : (
                  <AnimatePresence initial={false}>
                    {bids.map((bid, idx) => {
                      const medal =
                        idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : null;
                      const isTop = idx < 3;
                      return (
                        <motion.div
                          key={bid.id}
                          layout
                          initial={{ opacity: 0, y: -12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex items-center gap-4 px-4 py-3 rounded-xl border ${
                            idx === 0
                              ? "border-[#D4AF37]/60 bg-[#D4AF37]/10"
                              : "border-white/8 bg-white/4"
                          }`}
                        >
                          {/* Rank */}
                          <div className="w-8 text-center shrink-0">
                            {medal ? (
                              <span className="text-xl leading-none">{medal}</span>
                            ) : (
                              <span className="text-white/40 font-bold text-sm">
                                {idx + 1}
                              </span>
                            )}
                          </div>

                          {/* Bidder */}
                          <div className="flex-1 flex items-center gap-2 min-w-0">
                            <User
                              className={`w-4 h-4 shrink-0 ${isTop ? "text-[#D4AF37]" : "text-white/50"}`}
                            />
                            <span
                              className={`font-semibold truncate ${
                                idx === 0 ? "text-[#D4AF37]" : "text-white"
                              }`}
                            >
                              {bid.bidderName}
                            </span>
                          </div>

                          {/* Amount */}
                          <div className="shrink-0 text-right">
                            <span
                              className={`font-playfair font-bold text-base ${
                                idx === 0 ? "text-[#D4AF37]" : "text-white"
                              }`}
                            >
                              NPR {bid.amount.toLocaleString()}
                            </span>
                          </div>

                          {/* Time */}
                          <div className="shrink-0 text-white/40 text-xs w-16 text-right">
                            {timeAgo(bid.createdAt)}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
