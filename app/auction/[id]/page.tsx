"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}

export default function AuctionItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState<AuctionItem | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [prevBid, setPrevBid] = useState<number | null>(null);

  // Fetch item details and update bid/time regularly
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchItem() {
      const res = await fetch(`/api/auction/items/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPrevBid(item?.currentBid ?? null);
        setItem(data);
        setTimeRemaining(formatTimeRemaining(data.endTime));
      }
    }
    fetchItem();
    interval = setInterval(fetchItem, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [id]);

  // Update time every second
  useEffect(() => {
    if (!item?.endTime) return;
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(item.endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [item?.endTime]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#f5f5f5]/60">
        Loading auction item...
      </div>
    );
  }

  const isClosed = !item.isActive || (item.endTime && new Date(item.endTime).getTime() <= new Date().getTime());

  return (
    <main className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-start p-0 m-0">
      {/* Title at the top, center-aligned */}
      <div className="w-full max-w-7xl mx-auto px-8 pt-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center"
        >
          <h1 className="font-playfair text-5xl md:text-7xl font-extrabold text-[#D4AF37] m-0 p-0">
            {item.title}
          </h1>
        </motion.div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-8 flex flex-col md:flex-row gap-12 items-stretch">
        {/* Left column: image, description, time, starting bid */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-start">
          {item.imageUrl && (
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]/30 mb-8">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              {!isClosed && (
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-2 rounded-full bg-[#D4AF37] text-[#1a1a1a] text-lg font-bold uppercase shadow-lg">
                    Live
                  </span>
                </div>
              )}
            </div>
          )}
          {/* Description below image, left-aligned */}
          <p className="text-base md:text-lg text-[#f5f5f5]/80 max-w-2xl mb-6 md:text-left text-center">
            {item.description}
          </p>
          {item.endTime && (
            <div className="flex items-center gap-2 text-base text-[#f5f5f5]/80 mb-2">
              <Clock size={20} />
              <span className={isClosed ? "text-red-400 font-bold" : "font-bold"}>
                {isClosed ? "Closed" : `Time Left: ${timeRemaining}`}
              </span>
            </div>
          )}
        </div>
        {/* Right column: big current bid and starting bid */}
        <div className={`flex-1 flex flex-col justify-center items-center glass-strong rounded-2xl p-12 ${isClosed ? "opacity-60" : ""}`}>
          <div className="w-full text-center flex flex-col items-center justify-center">
            <div className="text-lg md:text-xl text-[#f5f5f5]/60 mb-4">Current Bid (NPR)</div>
            <motion.div
              key={item.currentBid}
              initial={{ scale: 1.2, boxShadow: "0 0 40px #D4AF37BB" }}
              animate={{ scale: 1, boxShadow: [
                "0 0 40px #D4AF37BB",
                "0 0 20px #D4AF37BB"
              ] }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.5
              }}
              className="font-playfair text-6xl md:text-7xl font-extrabold text-[#D4AF37] mb-2 bg-[#1a1a1a] rounded-2xl px-14 py-8 shadow-gold focus:outline-none"
              style={{ boxShadow: "0 0 40px #D4AF37BB" }}
            >
              {item.currentBid.toLocaleString()}
            </motion.div>
            {item.currentBidder && (
              <div className="text-xl text-[#f5f5f5]/80 mt-4 font-semibold">
                Leading: {item.currentBidder}
              </div>
            )}
            {/* Starting bid moved here */}
            <div className="mt-8 pt-4 border-t border-[#D4AF37]/30 w-full text-sm text-[#f5f5f5]/60 text-center">
              Starting bid: NPR {item.startingBid.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
