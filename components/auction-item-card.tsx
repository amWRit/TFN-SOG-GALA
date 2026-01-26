"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  useEffect(() => {
    if (!item.endTime || !item.isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(item.endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [item.endTime, item.isActive]);

  const isClosed = !item.isActive || (item.endTime && new Date(item.endTime).getTime() <= new Date().getTime());

  return (
    <Card className={`glass-strong overflow-hidden hover:scale-105 transition-transform duration-300 ${
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
              <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#1a1a1a] text-xs font-bold uppercase">
                Live
              </span>
            </div>
          )}
        </div>
      )}

      <CardHeader>
        <CardTitle className="line-clamp-2">{item.title}</CardTitle>
        {item.description && (
          <CardDescription className="line-clamp-2">
            {item.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent>
        {/* Current Bid */}
        <div className="mb-4">
          <div className="text-sm text-[#f5f5f5]/60 mb-1">Current Bid</div>
          <motion.div
            key={item.currentBid}
            initial={{ scale: 1.2, color: "#D4AF37" }}
            animate={{ scale: 1, color: "#D4AF37" }}
            className="font-playfair text-3xl font-bold"
          >
            ${item.currentBid.toLocaleString()}
          </motion.div>
          {item.currentBidder && (
            <div className="text-sm text-[#f5f5f5]/80 mt-1">
              Leading: {item.currentBidder}
            </div>
          )}
        </div>

        {/* Time Remaining */}
        {item.endTime && (
          <div className="flex items-center gap-2 text-sm text-[#f5f5f5]/80">
            <Clock size={16} />
            <span className={isClosed ? "text-red-400" : ""}>
              {isClosed ? "Closed" : `Time Left: ${timeRemaining}`}
            </span>
          </div>
        )}

        {/* Starting Bid Info */}
        <div className="mt-4 pt-4 border-t border-[#D4AF37]/20 text-xs text-[#f5f5f5]/60">
          Starting bid: ${item.startingBid.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}
