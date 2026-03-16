"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Clock, Gavel } from "lucide-react";

interface AuctionItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endTime: Date | null;
  isActive: boolean;
}

interface AuctionItemCardProps {
  item: AuctionItem;
}

function formatTimeRemaining(endTime: Date | null): string {
  if (!endTime) return "No time limit";
  
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const diff = end - now;

  if (diff <= 0) return "Closed";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${seconds}s`;
}

// CollapsibleDescription for auction card (must be at module scope)

function DescriptionPreview({ description, title, onReadMore }: { description: string, title: string, onReadMore: () => void }) {
  const isLong = description.length > 120;
  return (
    <div className="text-[#1f365f]/80 text-sm mt-1">
      <span className="whitespace-pre-line">
        {isLong ? description.slice(0, 120) + "..." : description}
      </span>
      {isLong && (
        <button
          className="ml-2 text-[#d13239] hover:underline font-semibold focus:outline-none"
          type="button"
          onClick={e => { e.stopPropagation(); onReadMore(); }}
        >
          Read more
        </button>
      )}
    </div>
  );
}

export function AuctionItemCard({ item }: AuctionItemCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(formatTimeRemaining(item.endTime));
  const [showBidModal, setShowBidModal] = useState(false);
  const [showDescModal, setShowDescModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<string|null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      // Check server session
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setIsAdmin(data.authenticated === true);
      setCheckingAdmin(false);
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    if (!item.endTime || !item.isActive) return;
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(item.endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [item.endTime, item.isActive]);

  const isClosed = !item.isActive || (item.endTime && new Date(item.endTime).getTime() <= new Date().getTime());

  if (checkingAdmin) {
    return (
      <div className="h-72 rounded-2xl bg-gray-100 border border-gray-200 animate-pulse flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d13239]" />
      </div>
    );
  }

  return (
    <>
      {/* Description Modal (overlay, not inside Card) */}
      {showDescModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 rounded-lg p-4 md:p-8 min-w-0 w-full max-w-xs md:min-w-[320px] md:max-w-md text-left relative border-2 border-[#d13239]/60 shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              className="fixed md:absolute top-4 right-4 md:top-2 md:right-2 text-[#d13239] hover:text-white text-3xl md:text-2xl z-50"
              style={{lineHeight: 1, background: 'none', border: 'none'}}
              onClick={e => { e.stopPropagation(); setShowDescModal(false); }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="pt-8 md:pt-2 mb-4 text-xl md:text-2xl font-bold text-[#d13239] break-words text-center">{item.title}</div>
            <div className="text-gray-200 whitespace-pre-line text-base break-words" style={{wordBreak: 'break-word'}}>
              {item.description}
            </div>
          </div>
        </div>
      )}
      <Card
        className={`group relative border overflow-hidden transition-all duration-300 rounded-2xl ${
          isClosed
            ? "border-gray-200 opacity-70 cursor-default"
            : "border-gray-200 cursor-pointer hover:border-[#d13239] hover:shadow-xl hover:shadow-[#d13239]/15 hover:-translate-y-1"
        }`}
        style={{ background: '#dadfe1', backdropFilter: 'none' }}
        onClick={() => {
          if (isAdmin) {
            window.open(`/auction/${item.id}`, '_blank');
          } else if (!isClosed && !showDescModal) {
            setShowBidModal(true);
          }
        }}
        tabIndex={isClosed ? -1 : 0}
        role="button"
        aria-disabled={isClosed ? true : undefined}
      >
      {/* Image — always shown, fallback if no imageUrl */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={item.imageUrl ?? "/images/auctionitemplaceholder.png"}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {isClosed ? (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-4 py-2 bg-gray-800/90 backdrop-blur-sm text-gray-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Auction Closed
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full bg-[#d13239] text-white text-xs font-bold uppercase shadow-lg animate-pulse">
              Live
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2 pt-4">
        <CardTitle className="line-clamp-2 text-[#1f365f] text-base font-bold leading-snug">{item.title}</CardTitle>
        {item.description && (
          <DescriptionPreview
            description={item.description ?? "NA"}
            title={item.title}
            onReadMore={() => setShowDescModal(true)}
          />
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Current Bid */}
        <div className="mb-4">
          <div className="text-xs text-[#1f365f] uppercase tracking-wider mb-1">Current Bid</div>

          <motion.div
            key={item.currentBid}
            initial={{ scale: 1.15, color: "#D4AF37" }}
            animate={{ scale: 1, color: "#D4AF37" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="font-playfair text-3xl font-bold"
            style={{ color: "#D4AF37" }}
          >
            NPR {item.currentBid.toLocaleString()}
          </motion.div>
          <div className="text-xs text-[#1f365f] mt-1">
            {item.currentBidder ? (
              <span>Leading: <span className="text-[#1f365f] font-semibold">{item.currentBidder}</span></span>
            ) : (
              <span className="text-[#1f365f]/70">No bids yet</span>
            )}
          </div>
        </div>

        {/* Time + Starting Bid */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-[#1f365f]/20 text-xs w-full">
          <div className="flex items-center gap-1.5">
            {item.endTime && (
              <>
                <Clock size={13} className="shrink-0 text-[#1f365f]" />
                <span className={isClosed ? "text-red-500 font-semibold" : "text-[#1f365f]"}>
                  {isClosed ? "Closed" : timeRemaining}
                </span>
              </>
            )}
          </div>
          <div className="text-[#1f365f]">
            Start: NPR {item.startingBid.toLocaleString()}
          </div>
        </div>

        {/* Action hint */}
        <div className="mt-4 flex justify-center">
          {isAdmin ? (
            <div className="text-[#d13239] font-medium flex items-center gap-1.5 text-xs">
              <Eye size={14} /> Click to view details
            </div>
          ) : (
            !isClosed && (
              <div className="w-full py-2.5 rounded-xl bg-[#d13239] text-white font-bold flex items-center gap-2 justify-center text-sm shadow-lg">
                <Gavel size={15} /> Place a Bid
              </div>
            )
          )}
        </div>

        {showBidModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md" onClick={e => { if (e.target === e.currentTarget) setShowBidModal(false); }}>
            <div className="bg-[#0d1a30] rounded-2xl p-6 w-full max-w-sm border border-[#d13239]/40 shadow-2xl mx-4 relative">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none"
                onClick={e => { e.stopPropagation(); setShowBidModal(false); }}
                aria-label="Close"
              >
                ×
              </button>
              <div className="mb-6">
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Placing bid on</div>
                <div className="text-lg font-bold text-white line-clamp-1">{item.title}</div>
                <div className="text-[#D4AF37] font-semibold text-sm mt-0.5">Current: NPR {item.currentBid.toLocaleString()}</div>
              </div>
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (isClosed || submitting) return;
                  setError(null);
                  setSuccess(null);
                  setSubmitting(true);
                  try {
                    const res = await fetch("/api/auction/items/bid", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        auctionItemId: item.id,
                        amount: Number(bidAmount),
                        bidderName: bidderName.trim(),
                      }),
                    });
                    if (res.ok) {
                      setSuccess("Bid placed successfully!");
                      setBidAmount("");
                      setBidderName("");
                      setTimeout(() => setShowBidModal(false), 1200);
                    } else {
                      const data = await res.json();
                      setError(data.error || "Failed to place bid");
                    }
                  } catch (err) {
                    setError("Network error. Please try again.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-medium uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 focus:outline-none focus:border-[#d13239] transition-colors placeholder:text-gray-500"
                    placeholder="Enter your name"
                    value={bidderName}
                    onChange={e => setBidderName(e.target.value)}
                    required
                    minLength={2}
                    maxLength={32}
                    disabled={submitting}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 font-medium uppercase tracking-wider">
                    Bid Amount
                    <span className="ml-1 text-gray-500 normal-case">(min NPR {(item.currentBid + 1).toLocaleString()})</span>
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 focus:outline-none focus:border-[#d13239] transition-colors placeholder:text-gray-500"
                    placeholder={`NPR ${(item.currentBid + 1).toLocaleString()}`}
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    min={item.currentBid + 1}
                    step={1}
                    required
                    disabled={submitting}
                  />
                </div>
                {error && (
                  <div className="text-red-400 text-sm text-center bg-red-400/10 px-3 py-2 rounded-xl">{error}</div>
                )}
                {success && (
                  <div className="text-green-400 text-sm text-center bg-green-400/10 px-3 py-2 rounded-xl">{success}</div>
                )}
                <button
                  type="submit"
                  className="w-full py-3 mt-1 rounded-xl bg-[#d13239] hover:bg-[#b82b31] text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
                  disabled={isClosed || submitting}
                >
                  <Gavel size={16} />
                  {submitting ? "Placing Bid…" : "Confirm Bid"}
                </button>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}
