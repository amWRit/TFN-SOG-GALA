"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Clock, Gavel } from "lucide-react";
import { BidModal } from "@/components/auction-bid-modal";
import { AuctionDescModal } from "@/components/auction-desc-modal";

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
    <div className="text-[#225898] text-sm mt-1">
      <span className="whitespace-pre-line">
        {isLong ? description.slice(0, 120) + "..." : description}
      </span>
      {isLong && (
        <button
          className="ml-2 text-[#d71a21] hover:underline font-semibold focus:outline-none"
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d71a21]" />
      </div>
    );
  }

  return (
    <>
      {/* Bid Modal */}
      {showBidModal && (
        <BidModal item={item} onClose={() => setShowBidModal(false)} />
      )}
      {/* Description Modal */}
      {showDescModal && (
        <AuctionDescModal
          title={item.title}
          description={item.description ?? ""}
          onClose={() => setShowDescModal(false)}
        />
      )}
      <Card
        className={`group relative border overflow-hidden transition-all duration-300 rounded-2xl ${
          isClosed
            ? "border-gray-200 opacity-70 cursor-default"
            : "border-gray-200 cursor-pointer hover:border-[#d71a21] hover:shadow-xl hover:shadow-[#d71a21]/15 hover:-translate-y-1"
        }`}
        style={{ background: '#eef3fb', borderTop: '5px solid #d71a21' }}
        onClick={() => {
          if (isAdmin) {
            window.open(`/auction/${item.id}`, '_blank');
          } else if (!isClosed && !showDescModal && !showBidModal) {
            // setShowBidModal(true);
          }
          // Bid modal is now disabled for normal users
        }}
        tabIndex={isClosed ? -1 : 0}
        role="button"
        aria-disabled={isClosed ? true : undefined}
      >
      {/* Image — always shown, fallback if no imageUrl */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={item.imageUrl ?? "/images/auctionitemplateholder.jpg"}
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
            <span className="px-3 py-1 rounded-full bg-[#d71a21] text-white text-xs font-bold uppercase shadow-lg animate-pulse">
              Live
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2 pt-4">
        <CardTitle className="line-clamp-2 text-[#084691] text-base font-bold leading-snug">{item.title}</CardTitle>
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
          <div className="text-xs text-[#084691] uppercase tracking-wider mb-1">Current Bid</div>

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
          <div className="text-xs text-[#084691] mt-1">
            {item.currentBidder ? (
              <span>Leading: <span className="text-[#084691] font-semibold">{item.currentBidder}</span></span>
            ) : (
              <span className="text-[#084691]/70">No bids yet</span>
            )}
          </div>
        </div>

        {/* Time + Starting Bid */}
        <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-[#084691]/20 text-xs w-full">
          <div className="flex items-center gap-1.5">
            {item.endTime && (
              <>
                <Clock size={13} className="shrink-0 text-[#225898]" />
                <span className={isClosed ? "text-red-500 font-semibold" : "text-[#225898]"}>
                  {isClosed ? "Closed" : timeRemaining}
                </span>
              </>
            )}
          </div>
          <div className="text-[#225898]">
            Start: NPR {item.startingBid.toLocaleString()}
          </div>
        </div>

        {/* Action hint */}
        <div className="mt-4 flex justify-center">
          {isAdmin ? (
            <div className="text-[#d71a21] font-medium flex items-center gap-1.5 text-xs">
              <Eye size={14} /> Click to view details
            </div>
          ) : (
            // !isClosed && (
            //   <div className="w-full py-2.5 rounded-xl bg-[#d71a21] text-white font-bold flex items-center gap-2 justify-center text-sm shadow-lg">
            //     <Gavel size={15} /> Place a Bid
            //   </div>
            // )
            null
          )}
        </div>

      </CardContent>
    </Card>
    </>
  );
}
