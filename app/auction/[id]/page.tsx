"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Clock, Gavel, Home } from "lucide-react";
import styles from '../../../styles/homepage.module.css';

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

/**
 * CollapsibleDescription component for showing/hiding long descriptions.
 */
function CollapsibleDescription({ description }: { description: string | null }) {
  const [open, setOpen] = useState(false);
  if (!description) return null;
  const isLong = description.length > 180;
  return (
    <div className="mb-6 w-full">
      <div className="text-base text-[#f5f5f5]/90 whitespace-pre-line text-left">
        {isLong && !open
          ? description.slice(0, 180) + "..."
          : description}
      </div>
      {isLong && (
        <button
          className="mt-2 text-pink-400 hover:underline font-semibold"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default function AuctionItemPage() {
  const { id } = useParams();
  const [item, setItem] = useState<AuctionItem | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [prevBid, setPrevBid] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = require('next/navigation').useRouter();

  // Admin check: Only allow access if adminauth is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const admin = !!localStorage.getItem("adminauth");
      setIsAdmin(admin);
      if (!admin) {
        router.replace("/auction");
      }
    }
  }, [router]);

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


  if (isAdmin === false) {
    return null;
  }
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#f5f5f5]/60">
        Loading auction item...
      </div>
    );
  }

  const isClosed = !item.isActive || (item.endTime && new Date(item.endTime).getTime() <= new Date().getTime());

  return (
    <main className={styles.heroContainer + " min-h-screen flex flex-col items-center justify-center p-0 m-0 pb-8"}>
      {/* Title and Home Button in a horizontal bar at the top */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className=""
        >
          <h1 className="font-playfair text-3xl md:text-5xl font-extrabold text-white m-0 p-0 text-left">
            {item.title}
          </h1>
        </motion.div>
        <a href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-full shadow-lg font-semibold hover:bg-white transition-all border border-gray-200">
          <Home className="w-5 h-5" />
          Home
        </a>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 flex-1 flex flex-col md:flex-row gap-8 items-stretch justify-center">
        {/* Left column: image, description, time, starting bid */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center min-h-0">
          {item.imageUrl && (
            <div className="relative w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#ec4899]/30 mb-6">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute top-4 right-4">
                {isClosed ? (
                  <span className="px-4 py-2 rounded-full bg-gray-700 text-white text-lg font-bold uppercase shadow-lg">
                    Closed
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-[#ec4899] text-white text-lg font-bold uppercase shadow-lg">
                    Live
                  </span>
                )}
              </div>
            </div>
          )}
          {/* Collapsible Description below image, left-aligned */}
          <CollapsibleDescription description={item.description} />
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
        <div className={`flex-1 flex flex-col justify-center items-center glass-strong rounded-2xl p-6 md:p-10 ${isClosed ? "opacity-60" : ""}`}>
          <div className="w-full text-center flex flex-col items-center justify-center min-h-0">
            <div className="text-xl md:text-2xl text-[#f5f5f5]/60 mb-4">Current Bid (NPR)</div>
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
              className="font-playfair text-7xl md:text-8xl font-extrabold text-[#D4AF37] mb-4 rounded-2xl px-16 py-10 focus:outline-none"
              style={{
                boxShadow: "0 0 40px #D4AF37BB",
                // background: "#23272F"
              }}
            >
              {item.currentBid.toLocaleString()}
            </motion.div>
            {item.currentBidder && (
              <div className="text-2xl md:text-3xl text-[#f5f5f5]/80 mt-6 font-semibold">
                Leading: {item.currentBidder}
              </div>
            )}
            {/* Starting bid moved here */}
            <div className="mt-10 pt-6 border-t border-[#ec4899]/30 w-full text-lg md:text-xl text-[#f5f5f5]/60 text-center">
              Starting bid: NPR {item.startingBid.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
