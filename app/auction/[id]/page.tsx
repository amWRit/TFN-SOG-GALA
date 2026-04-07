"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Home, Gavel } from "lucide-react";
import { AuctionDescModal } from "../../../components/auction-desc-modal";
import { AuctionBidHistory } from "../../../components/auction-bid-history";
import PopperConfetti from "../../../components/PopperConfetti";

interface AuctionItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startingBid: number;
  actualPrice: number;
  soldPrice: number;
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
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const confettiFiredRef = useRef(false);

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

  useEffect(() => {
    if (!item) return;
    const closed =
      !item.isActive ||
      (item.endTime && new Date(item.endTime).getTime() <= new Date().getTime());
    if (closed && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      setConfettiTrigger((t) => t + 1);
      // const audio = new Audio("/audio/tada.mp3");
      // audio.play().catch(() => {});
    }
  }, [item]);

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
        <div className="flex gap-2 ml-4">
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#084691] rounded-full shadow-lg font-semibold hover:bg-[#084691]/90 hover:text-white transition-all border border-[#084691] shrink-0"
          >
            <Home className="w-5 h-5" />
            Home
          </a>
          <a
            href="/auction"
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#084691] rounded-full shadow-lg font-semibold hover:bg-[#084691]/90 hover:text-white transition-all border border-[#084691] shrink-0"
          >
            <Gavel className="w-5 h-5" />
            Auction
          </a>
        </div>
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
        <div
          className="flex flex-col rounded-2xl border border-[#D4AF37] backdrop-blur-md shadow-xl p-6 md:p-10"
          style={{ background: "rgba(8,70,145,0.15)" }}
        >
          <div className="flex-1 flex flex-col justify-center gap-8">

            {/* Two frosted stat cards */}
            <div className="flex flex-col gap-4">

              {/* Card 1: Actual Price (active) / Sold Price (closed) */}
              <div
                className="flex flex-col items-center justify-center rounded-2xl p-5 border border-[#D4AF37]/50"
                style={{ background: "rgba(212,175,55,0.07)" }}
              >
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/60 mb-3 text-center">
                  {isClosed ? "Final Bid" : "Actual Price"}
                </span>
                <span
                  className="font-playfair font-extrabold text-[#D4AF37] text-center leading-tight"
                  style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
                >
                  {isClosed
                    ? (item.soldPrice > 0 ? item.soldPrice : item.currentBid).toLocaleString()
                    : item.actualPrice.toLocaleString()}
                </span>
                <span className="text-white/40 text-[10px] mt-2">NPR</span>
              </div>

              {/* Card 2: Starting Bid (active) / Sold To (closed) */}
              <div
                className="flex flex-col items-center justify-center rounded-2xl p-5 border border-white/15"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/60 mb-3 text-center">
                  {isClosed ? "Sold To" : "Starting Bid"}
                </span>
                {isClosed ? (
                  <span
                    className="font-playfair font-bold text-white text-center leading-snug"
                    style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", wordBreak: "break-word" }}
                  >
                    {item.currentBidder ?? "—"}
                  </span>
                ) : (
                  <>
                    <span
                      className="font-playfair font-extrabold text-white text-center leading-tight"
                      style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
                    >
                      {item.startingBid.toLocaleString()}
                    </span>
                    <span className="text-white/40 text-[10px] mt-2">NPR</span>
                  </>
                )}
              </div>
            </div>

            {/* Status pill */}
            {isClosed ? (
              <div className="px-6 py-2.5 rounded-full bg-gray-700/50 border border-white/20 text-white/70 text-sm font-semibold uppercase tracking-widest text-center">
                Bidding Closed
              </div>
            ) : (
              <div className="px-6 py-2.5 rounded-full bg-green-500/20 border border-green-400/40 text-green-300 text-sm font-semibold uppercase tracking-widest text-center">
                Bidding Open
              </div>
            )}
          </div>
        </div>
      </div>

      <AuctionBidHistory itemId={id as string} />
      <PopperConfetti trigger={confettiTrigger} />

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