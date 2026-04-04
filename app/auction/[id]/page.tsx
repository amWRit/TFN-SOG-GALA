"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Home, TrendingUp, User } from "lucide-react";
import { AuctionDescModal } from "../../../components/auction-desc-modal";

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
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function CollapsibleDescription({
  description,
  onReadMore,
}: {
  description: string | null;
  onReadMore?: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (!description) return null;
  const isLong = description.length > 180;
  return (
    <div className="w-full">
      <div className="text-base text-white whitespace-pre-line text-left">
        {isLong && !open ? description.slice(0, 180) + "..." : description}
      </div>
      {isLong && (
        <button
          className="mt-2 text-[#d71a21] hover:underline font-semibold"
          onClick={() => {
            if (!open && onReadMore) onReadMore();
            else setOpen((v) => !v);
          }}
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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [showDescModal, setShowDescModal] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setIsAdmin(data.authenticated === true);
      if (!data.authenticated) router.replace("/auction");
    }
    checkAdmin();
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchItem() {
      const res = await fetch(`/api/auction/items/${id}`);
      if (res.ok) {
        const data = await res.json();
        setItem(data);
        setTimeRemaining(formatTimeRemaining(data.endTime));
      }
    }
    fetchItem();
    interval = setInterval(fetchItem, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (!item?.endTime) return;
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(item.endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [item?.endTime]);

  if (isAdmin === null || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d71a21]" />
      </div>
    );
  }

  if (isAdmin === false) return null;

  const isClosed =
    !item.isActive ||
    (item.endTime && new Date(item.endTime).getTime() <= new Date().getTime());

  return (
    <main className="relative min-h-screen flex flex-col p-0 m-0 w-full overflow-hidden">
      <style>{`
        @keyframes bidZoomPulse {
          0%   { transform: scale(1);    text-shadow: 0 0 0px rgba(212,175,55,0); }
          45%  { transform: scale(1.12); text-shadow: 0 0 24px rgba(212,175,55,0.55); }
          100% { transform: scale(1);    text-shadow: 0 0 0px rgba(212,175,55,0); }
        }
        @keyframes bidRingPulse {
          0%   { opacity: 0.25; transform: scale(1); }
          50%  { opacity: 0.7;  transform: scale(1.025); }
          100% { opacity: 0.25; transform: scale(1); }
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 bg-gray-900 -z-10">
        <img
          src="/samples/conceptnotes/images/1.jpg"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#084691]/88 via-[#225898]/75 to-[#084691]/88 -z-10" />

      {/* Top bar */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 pt-12 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-playfair text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            {item.title}
          </h1>
        </motion.div>
        <a
          href="/auction"
          className="flex items-center gap-2 px-4 py-2 bg-white text-[#084691] rounded-full shadow-lg font-semibold hover:bg-[#084691]/90 hover:text-white transition-all border border-[#084691] shrink-0 ml-4"
        >
          <Home className="w-5 h-5" />
          Home
        </a>
      </div>

      {/* Grid: single col on mobile, two cols on md+ */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* ── LEFT COLUMN ── */}
        <div className="flex flex-col" style={{ minHeight: 0 }}>

          {/* Fixed-height image */}
          <div
            className="relative w-full shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37] mb-4"
            style={{ height: "380px" }}
          >
            <Image
              src={item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : "/images/auctionitemplateholder.jpg"}
              alt={item.title}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-4 right-4">
              {isClosed ? (
                <span className="px-4 py-2 rounded-full bg-gray-700/90 text-white text-sm font-bold uppercase shadow-lg backdrop-blur-sm">
                  Closed
                </span>
              ) : (
                <span className="px-4 py-2 rounded-full bg-[#d71a21] text-white text-sm font-bold uppercase shadow-lg animate-pulse">
                  Live
                </span>
              )}
            </div>
            {!isClosed && item.endTime && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-mono">
                <Clock className="w-4 h-4 text-[#d71a21]" />
                {timeRemaining}
              </div>
            )}
          </div>

          {/* Description + timer card — flex-1 so it fills whatever height remains */}
          <div
            className="flex-1 rounded-2xl border border-white/10 p-5 flex flex-col justify-between backdrop-blur-sm"
            style={{ background: "rgba(255,255,255,0.04)", minHeight: 0 }}
          >
            <CollapsibleDescription
              description={item.description}
              onReadMore={() => setShowDescModal(true)}
            />
            {item.endTime && (
              <div className="flex items-center gap-2 text-sm pt-3 border-t border-white/10 mt-auto">
                <Clock size={16} className="text-[#d71a21] shrink-0" />
                <span className={isClosed ? "text-red-400 font-semibold" : "text-white font-semibold"}>
                  {isClosed ? "Auction Closed" : `Time Left: ${timeRemaining}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        {/* flex flex-col + h-full not needed — grid stretch handles it */}
        <div
          className={`flex flex-col rounded-2xl border border-[#D4AF37] backdrop-blur-md shadow-xl p-6 md:p-10 ${isClosed ? "opacity-60" : ""}`}
          style={{ background: "rgba(8,70,145,0.15)" }}
        >
          {/* Label */}
          <div className="text-base md:text-xl uppercase tracking-widest text-white font-bold mb-6 text-center shrink-0">
            {item.currentBid > 0 ? "Current Bid (NPR)" : "Starting Bid (NPR)"}
          </div>

          {/* Bid amount — flex-1 centres it vertically */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              key={item.currentBid > 0 ? item.currentBid : item.startingBid}
              initial={{ scale: 1.18, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="relative w-full flex items-center justify-center"
            >
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
                className="w-full flex items-center justify-center rounded-2xl py-8 px-6"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(8,70,145,0.08) 100%)",
                  border: "1.5px solid transparent",
                  boxShadow: isClosed
                    ? "none"
                    : "0 0 32px 4px rgba(212,175,55,0.18), 0 2px 24px 0 rgba(0,0,0,0.4)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  className="font-playfair font-extrabold text-[#D4AF37] text-center w-full"
                  style={{
                    fontSize: "clamp(3rem, 6vw, 5.5rem)",
                    wordBreak: "break-all",
                    lineHeight: 1.1,
                    animation: isClosed ? "none" : "bidZoomPulse 2.6s ease-in-out infinite",
                    display: "block",
                  }}
                >
                  {(item.currentBid > 0 ? item.currentBid : item.startingBid).toLocaleString()}
                </span>
              </div>
            </motion.div>

            {item.currentBid > 0 && item.currentBidder && (
              <div className="flex items-center justify-center gap-2 bg-[#084691]/20 px-5 py-3 rounded-2xl mt-6 w-full">
                <User className="w-5 h-5 text-white shrink-0" />
                <span className="text-white font-semibold text-lg">{item.currentBidder}</span>
              </div>
            )}
          </div>

          {/* Bottom strip — always pinned to bottom of right card */}
          <div className="shrink-0 mt-6 pt-5 border-t border-white/10 flex flex-col items-center gap-3">
            {item.currentBid > 0 && (
              <div className="flex items-center gap-2 text-white text-sm">
                <TrendingUp className="w-4 h-4" />
                Starting bid: NPR {item.startingBid.toLocaleString()}
              </div>
            )}
            {isClosed && (
              <div className="px-6 py-3 bg-gray-100 rounded-2xl text-[#225898] font-semibold uppercase tracking-wider text-sm w-full text-center">
                Auction Closed
              </div>
            )}
          </div>
        </div>
      </div>

      {showDescModal && item.description && (
        <AuctionDescModal
          title={item.title}
          description={item.description}
          onClose={() => setShowDescModal(false)}
        />
      )}
    </main>
  );
}