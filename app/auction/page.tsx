"use client";
import { Home, List, Gavel, TrendingUp } from "lucide-react";
import auctionStyles from '../../styles/auction.module.css';
// Helper to get pathname safely
function getInitialPathname() {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '/';
}

// Helper hook to detect client mount
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}
import { AuctionGrid } from "@/components/auction-grid";
import { AuctionLeaderboard } from "@/components/auction-leaderboard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AuctionPage() {
  const [total, setTotal] = useState<number | null>(null);
  const [pathname, setPathname] = useState(getInitialPathname());
  const hasMounted = useHasMounted();

  useEffect(() => {
    async function fetchTotal() {
      try {
        const res = await fetch("/api/total-raised");
        if (res.ok) {
          const data = await res.json();
          setTotal(data.total);
        }
      } catch {}
    }
    fetchTotal();
    const interval = setInterval(fetchTotal, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4fa]">
      {/* Navigation Bar */}
      <div className={auctionStyles.auctionNavBar}>
        <a
          href="/"
          className={
            hasMounted && pathname === '/'
              ? `${auctionStyles.auctionNavLink} ${auctionStyles.auctionNavLinkActive}`
              : auctionStyles.auctionNavLink
          }
        >
          <Home size={18} style={{marginRight: 6, marginBottom: -2}} /> Home
        </a>
        <a
          href="/program"
          className={
            hasMounted && pathname.startsWith('/program')
              ? `${auctionStyles.auctionNavLink} ${auctionStyles.auctionNavLinkActive}`
              : auctionStyles.auctionNavLink
          }
        >
          <List size={18} style={{marginRight: 6, marginBottom: -2}} /> Program
        </a>
        <a
          href="/auction"
          className={
            hasMounted && pathname.startsWith('/auction')
              ? `${auctionStyles.auctionNavLink} ${auctionStyles.auctionNavLinkActive}`
              : auctionStyles.auctionNavLink
          }
        >
          <Gavel size={18} style={{marginRight: 6, marginBottom: -2}} /> Auction
        </a>
      </div>

      {/* ── Hero with background image ── */}
      <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[420px] md:min-h-[500px] pt-4 md:pt-24">
        {/* Background image */}
        <div className="absolute inset-0 bg-gray-900">
          <img
            src="/images/tfnimage2.jpg"
            alt="Auction"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        {/* Blue gradient overlay — same as homepage hero */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#084691]/88 via-[#225898]/75 to-[#084691]/88" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center px-4 py-4 md:py-8 w-full max-w-4xl mx-auto"
        >
          {/* Icon badge */}
          <div className="flex justify-center mb-5">
            <div className="p-4 rounded-full bg-white/15 border border-white/30 shadow-lg">
              <Gavel className="w-10 h-10 text-white" />
            </div>
          </div>

          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-10">
            Bid on exclusive experiences and items. All proceeds support Teach For Nepal's mission.
          </p>

          {/* Total Raised card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-md border border-white/30 px-10 py-6 rounded-3xl shadow-2xl"
          >
            <TrendingUp className="w-10 h-10 text-[#d71a21] shrink-0" />
            <div className="text-left">
              <div className="text-sm text-white/70 uppercase tracking-widest mb-1">Total Raised</div>
              <div className="font-playfair text-5xl md:text-6xl font-bold text-[#D4AF37]">
                {total === null
                  ? <span className="text-white/60 text-2xl">Loading…</span>
                  : `NPR ${total.toLocaleString()}`
                }
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Content below hero ── */}
      <div className="px-4 w-full pt-4 pb-4">
        <div className="max-w-7xl mx-auto">

          {/* ── Leaderboard ── */}
          <AuctionLeaderboard />

        </div>
      </div>

      {/* ── Auction Items Grid with blue hero bg ── */}
      <div className="relative w-full overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 bg-gray-900">
          <img
            src="/images/tfnimage2.jpg"
            alt="Auction items"
            className="w-full h-full object-cover opacity-25"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#084691]/88 via-[#225898]/75 to-[#084691]/88" />
        <div className="relative z-10 px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <AuctionGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
