"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Home, TrendingUp, User } from "lucide-react";
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
          className="mt-2 text-[#d13239] hover:underline font-semibold"
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
  const router = useRouter();
  const [item, setItem] = useState<AuctionItem | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [prevBid, setPrevBid] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Admin check
  useEffect(() => {
    async function checkAdmin() {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setIsAdmin(data.authenticated === true);
      if (!data.authenticated) {
        router.replace("/auction");
      }
    }
    checkAdmin();
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
    interval = setInterval(fetchItem, 3000);
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


  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d13239]" />
      </div>
    );
  }

  if (isAdmin === false) {
    return null;
  }
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d13239]" />
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
        <a href="/auction" className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-full shadow-lg font-semibold hover:bg-white transition-all border border-gray-200 shrink-0 ml-4">
          <Home className="w-5 h-5" />
          Back
        </a>
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 flex-1 flex flex-col md:flex-row gap-8 items-stretch justify-center">
        {/* Left column: image, description, time, starting bid */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center min-h-0">
          <div className="relative w-full h-[320px] md:h-[380px] rounded-2xl overflow-hidden shadow-2xl border border-[#dadfe1]/30 mb-6">
            <Image
              src={item.imageUrl ?? "/images/auctionitemplaceholder.png"}
              alt={item.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-4 right-4">
              {isClosed ? (
                <span className="px-4 py-2 rounded-full bg-gray-700/90 text-white text-sm font-bold uppercase shadow-lg backdrop-blur-sm">
                  Closed
                </span>
              ) : (
                <span className="px-4 py-2 rounded-full bg-[#d13239] text-white text-sm font-bold uppercase shadow-lg animate-pulse">
                  Live
                </span>
              )}
            </div>
            {!isClosed && item.endTime && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-mono">
                <Clock className="w-4 h-4 text-[#d13239]" />
                {timeRemaining}
              </div>
            )}
          </div>
          {/* Collapsible Description below image, left-aligned */}
          <CollapsibleDescription description={item.description} />
          {item.endTime && (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Clock size={16} className="text-[#d13239]" />
              <span className={isClosed ? "text-red-400 font-semibold" : "text-gray-300 font-semibold"}>
                {isClosed ? "Auction Closed" : `Time Left: ${timeRemaining}`}
              </span>
            </div>
          )}
        </div>

        {/* Right column: big current bid and starting bid */}
        <div className={`flex-1 flex flex-col justify-center items-center border border-[#D4AF37] rounded-2xl p-6 md:p-10 gap-6 ${isClosed ? "opacity-60" : ""}`}>
          <div className="w-full text-center flex flex-col items-center justify-center min-h-0">
            <div className="text-l md:text-xl uppercase tracking-widest text-[#d13239] font-bold mb-6">Current Bid (NPR)</div>

            {/* Bid amount card with zoom-pulse animation */}
            <motion.div
              key={item.currentBid}
              initial={{ scale: 1.18, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="relative w-full flex flex-col items-center justify-center mb-6"
            >
              {/* Outer glow ring — only when live */}
              {!isClosed && (
                <span
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    animation: "bidRingPulse 2s ease-in-out infinite",
                    border: "2px solid #D4AF37",
                    borderRadius: "1rem",
                  }}
                />
              )}
              <div
                className="w-full flex flex-col items-center justify-center rounded-2xl py-8 px-6"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(209,50,57,0.08) 100%)",
                  border: "1.5px solid transparent",
                  boxShadow: isClosed
                    ? "none"
                    : "0 0 32px 4px rgba(212,175,55,0.18), 0 2px 24px 0 rgba(0,0,0,0.4)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  className="font-playfair font-extrabold text-[#D4AF37] max-w-full"
                  style={{
                    fontSize: "clamp(3rem, 10vw, 5.5rem)",
                    wordBreak: "break-all",
                    overflowWrap: "break-word",
                    lineHeight: 1.1,
                    animation: isClosed ? "none" : "bidZoomPulse 2.6s ease-in-out infinite",
                    display: "block",
                  }}
                >
                  {item.currentBid.toLocaleString()}
                </span>
              </div>
            </motion.div>

            {/* Keyframe styles */}
            <style>{`
              @keyframes bidZoomPulse {
                0%   { transform: scale(1);     text-shadow: 0 0 0px rgba(212,175,55,0); }
                45%  { transform: scale(1.12); text-shadow: 0 0 24px rgba(212,175,55,0.55); }
                100% { transform: scale(1);     text-shadow: 0 0 0px rgba(212,175,55,0); }
              }
              @keyframes bidRingPulse {
                0%   { opacity: 0.25; transform: scale(1); }
                50%  { opacity: 0.7;  transform: scale(1.025); }
                100% { opacity: 0.25; transform: scale(1); }
              }
            `}</style>

            {item.currentBidder && (
              <div className="flex items-center gap-2 bg-white/10 px-5 py-3 rounded-2xl mt-2">
                <User className="w-5 h-5 text-[#d13239]" />
                <span className="text-white font-semibold text-lg">{item.currentBidder}</span>
              </div>
            )}
            <div className="mt-8 pt-6 border-t border-white/10 w-full flex items-center justify-center gap-2 text-gray-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              Starting bid: NPR {item.startingBid.toLocaleString()}
            </div>
            {isClosed && (
              <div className="mt-4 px-6 py-3 bg-gray-700/50 rounded-2xl text-gray-400 font-semibold uppercase tracking-wider text-sm">
                Auction Closed
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}