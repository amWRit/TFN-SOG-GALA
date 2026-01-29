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

export function AuctionItemCard({ item }: AuctionItemCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(
    formatTimeRemaining(item.endTime)
  );
  const [showBidModal, setShowBidModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check admin status from localStorage (adminauth)
    if (typeof window !== "undefined") {
      setIsAdmin(!!localStorage.getItem("adminauth"));
    }
  }, []);

  useEffect(() => {
    if (!item.endTime || !item.isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(item.endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [item.endTime, item.isActive]);

  const isClosed = !item.isActive || (item.endTime && new Date(item.endTime).getTime() <= new Date().getTime());

  return (
    <Card className={`bg-white/80 backdrop-blur-md border border-pink-300/30 shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300 ${
      isClosed ? "opacity-60" : ""
    }`}>
      {/* Image */}
      {item.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={item.imageUrl}
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
        <CardTitle className="line-clamp-2 text-white">{item.title}</CardTitle>
        {item.description && (
          <CardDescription className="line-clamp-2 text-gray-200 overflow-hidden text-ellipsis">
            {item.description}
          </CardDescription>
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
          <Button
            title="View Item"
            className="flex items-center gap-1 font-semibold hover:scale-105 transition bg-[#ec4899] hover:bg-pink-600 text-white"
            onClick={() => window.open(`/auction/${item.id}/`, "_blank")}
          >
            <Eye size={18} /> View
          </Button>
          <Button
            title="Bid"
            className="flex items-center gap-1 font-semibold hover:scale-105 transition bg-[#ec4899] hover:bg-pink-600 text-white"
            onClick={() => setShowBidModal(true)}
            disabled={!!isClosed}
          >
            <Gavel size={18} /> Bid
          </Button>
        </div>

        {/* Bid Modal Placeholder */}
        {showBidModal && !isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-gray-900 rounded-lg p-8 min-w-[300px] max-w-[90vw] text-center relative">
              <button
                className="absolute top-2 right-2 text-pink-300 hover:text-white"
                onClick={() => setShowBidModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="mb-4 text-2xl font-bold text-pink-300">Place a Bid</div>
              <div className="mb-6 text-gray-200">Bid modal coming soon.</div>
              <Button
                variant="red"
                className="px-4 py-2 font-semibold hover:scale-105"
                onClick={() => setShowBidModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
