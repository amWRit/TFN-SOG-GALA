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
      {/* Hero section with image and blue gradient */}
      <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[180px] md:min-h-[220px] mb-0 pt-4 md:pt-24 pb-4" style={{ borderRadius: 0 }}>
        {/* Background image */}
        <div className="absolute inset-0 bg-gray-900">
          <img
            src="/images/tfnimage2.jpg"
            alt="Auction Hero"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        {/* Blue gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#084691]/88 via-[#225898]/75 to-[#084691]/88" />
        <div className="relative z-10 text-center px-4 py-4 w-full max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 max-w-6xl mx-auto" style={{ letterSpacing: 1 }}>
            Auction <span className="text-[#d71a21]">Details</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-4xl mx-auto mb-2 break-words">
            Bid on exclusive experiences and items. All proceeds support Teach For Nepal's mission.
          </p>
        </div>
      </div>
      <div className="w-full h-[10px] bg-white/90" />

      {/* ── Content below hero ── */}
      {/* <div className="px-4 w-full pt-4 pb-4">
        <div className="max-w-7xl mx-auto">

          <AuctionLeaderboard />

        </div>
      </div> */}

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
        <div className="relative z-10" style={{ padding: 32 }}>
          <AuctionGrid />
        </div>
      </div>
    </div>
  );
}
