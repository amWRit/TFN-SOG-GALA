"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="text-gray-200 text-sm mt-1">
      <span className="whitespace-pre-line">
        {isLong ? description.slice(0, 120) + "..." : description}
      </span>
      {isLong && (
        <button
          className="ml-2 text-pink-400 hover:underline font-semibold focus:outline-none"
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

  if (checkingAdmin) return null;

  return (
    <>
      {/* Description Modal (overlay, not inside Card) */}
      {showDescModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 rounded-lg p-4 md:p-8 min-w-0 w-full max-w-xs md:min-w-[320px] md:max-w-md text-left relative border-2 border-pink-400/60 shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              className="fixed md:absolute top-4 right-4 md:top-2 md:right-2 text-pink-300 hover:text-white text-3xl md:text-2xl z-50"
              style={{lineHeight: 1, background: 'none', border: 'none'}}
              onClick={e => { e.stopPropagation(); setShowDescModal(false); }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="pt-8 md:pt-2 mb-4 text-xl md:text-2xl font-bold text-pink-300 break-words text-center">{item.title}</div>
            <div className="text-gray-200 whitespace-pre-line text-base break-words" style={{wordBreak: 'break-word'}}>
              {item.description}
            </div>
          </div>
        </div>
      )}
      <Card
        className={`bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden hover:scale-105 transition-transform duration-300 ${isClosed ? "opacity-60" : "cursor-pointer"}`}
        style={{ background: "rgba(36,24,64,0.93)" }}
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
      {/* Image */}
      {item.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={item.imageUrl ?? "/images/auctionitemplaceholder.png"}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!isClosed && (
            <div className="absolute top-2 right-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold uppercase">
                Live
              </span>
            </div>
          )}
        </div>
      )}

      <CardHeader>
        <CardTitle className="line-clamp-2 text-white pt-2">{item.title}</CardTitle>
        {item.description && (
          <DescriptionPreview
            description={item.description ?? "NA"}
            title={item.title}
            onReadMore={() => setShowDescModal(true)}
          />
        )}
      </CardHeader>

      <CardContent>
        {/* Current Bid */}
        <div className="mb-4">
          <div className="text-sm text-gray-200 mb-1">Current Bid</div>
          <motion.div
            key={item.currentBid}
            initial={{ scale: 1.2, color: "#ec4899" }}
            animate={{ scale: 1, color: "#ec4899" }}
            className="font-playfair text-3xl font-bold text-pink-300"
          >
            NPR {item.currentBid.toLocaleString()}
          </motion.div>
          <div className="text-sm text-gray-200 mt-1">
            Leading: {item.currentBidder ? item.currentBidder : "NA"}
          </div>
        </div>

        {/* Time Remaining & Starting Bid - single row */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-white/20 text-sm text-gray-200 w-full">
          <div className="flex items-center gap-2">
            {item.endTime && (
              <>
                <Clock size={16} />
                <span className={isClosed ? "text-red-400" : ""}>
                  {isClosed ? "Closed" : `Time Left: ${timeRemaining}`}
                </span>
              </>
            )}
          </div>
          <div>
            Starting bid: NPR {item.startingBid.toLocaleString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-2">
          {isAdmin ? (
            <div className="text-pink-300 font-semibold flex items-center gap-2 justify-center mt-2">
              <Eye size={18} /> Click to View
            </div>
          ) : (
            !isClosed && (
              <div className="text-pink-300 font-semibold flex items-center gap-2 justify-center mt-2">
                <Gavel size={18} /> Click to Bid
              </div>
            )
          )}
        </div>

        {/* Bid Modal Implementation for public users */}
        {showBidModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
              <div className="bg-gray-900 rounded-lg p-4 md:p-8 min-w-0 w-full max-w-xs md:min-w-[300px] md:max-w-[380px] text-center relative border-2 border-pink-400/60">
                <button
                  className="absolute top-2 right-2 text-pink-300 hover:text-white text-2xl"
                  onClick={e => { e.stopPropagation(); setShowBidModal(false); }}
                  aria-label="Close"
                >
                  ×
                </button>
              <div className="mb-4 text-2xl font-bold text-pink-300">Place a Bid</div>
              <form
                className="flex flex-col gap-4 items-center"
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
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder="Your Name"
                  value={bidderName}
                  onChange={e => setBidderName(e.target.value)}
                  required
                  minLength={2}
                  maxLength={32}
                  disabled={submitting}
                />
                <input
                  type="number"
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  placeholder={`Bid Amount (min NPR ${(item.currentBid+1).toLocaleString()})`}
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  min={item.currentBid+1}
                  step={1}
                  required
                  disabled={submitting}
                />
                {error && <div className="text-red-400 text-sm">{error}</div>}
                {success && <div className="text-green-400 text-sm">{success}</div>}
                <Button
                  type="submit"
                   className="w-full mt-2 font-bold"
                  disabled={isClosed || submitting}
                >
                  {submitting ? "Placing Bid..." : "Place Bid"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}
