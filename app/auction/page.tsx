"use client";
import { Home, Gavel, TrendingUp } from "lucide-react";
import { AuctionGrid } from "@/components/auction-grid";
import { AuctionLeaderboard } from "@/components/auction-leaderboard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from '../../styles/homepage.module.css';

export default function AuctionPage() {
  const [total, setTotal] = useState<number | null>(null);
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
    <div className={styles.heroContainer}>
      {/* Home Button */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <a
          href="/"
          className="flex items-center gap-2 px-5 py-2 bg-white/90 text-gray-900 rounded-full shadow-lg font-semibold hover:bg-white transition-all border border-gray-200 text-sm"
        >
          <Home size={16} />
          Home
        </a>
      </div>

      <div className="pt-24 pb-24 px-4 w-full">
        <div className="max-w-7xl mx-auto">

          {/* ── Hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            {/* Icon badge */}
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-[#dadfe1]/10 border border-[#dadfe1]/30 shadow-lg shadow-[#dadfe1]/10">
                <Gavel className="w-10 h-10 text-[#dadfe1]" />
              </div>
            </div>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
              Bid on exclusive experiences and items. All proceeds support Teach For Nepal's mission.
            </p>

            {/* Total Raised card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="inline-flex items-center gap-6 bg-gradient-to-r from-[#0d1a30]/90 to-[#1a2d4f]/90 backdrop-blur-md border border-[#dadfe1]/30 px-14 py-8 rounded-3xl shadow-2xl shadow-black/30 mb-8"
            >
              <TrendingUp className="w-10 h-10 text-[#d13239] shrink-0" />
              <div className="text-left">
                <div className="text-base text-gray-400 uppercase tracking-widest mb-1">Total Raised</div>
                <div className="font-playfair text-5xl md:text-6xl font-bold text-[#D4AF37]">
                  {total === null
                    ? <span className="text-gray-500 text-2xl">Loading…</span>
                    : `NPR ${total.toLocaleString()}`
                  }
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Leaderboard ── */}
          <AuctionLeaderboard />

          {/* ── Section divider ── */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#dadfe1]/40 to-transparent" />
            <Gavel className="w-5 h-5 text-[#dadfe1]/60" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#dadfe1]/40 to-transparent" />
          </div>

          {/* ── Auction Items Grid ── */}
          <AuctionGrid />

        </div>
      </div>
    </div>
  );
}
