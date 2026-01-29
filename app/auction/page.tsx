"use client";
import { Home } from "lucide-react";
import { AuctionGrid } from "@/components/auction-grid";
import { AuctionLeaderboard } from "@/components/auction-leaderboard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
    <>
      {/* Home Button (floating, like seating page) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <a href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-full shadow-lg font-semibold hover:bg-white transition-all border border-gray-200">
          <Home size={20} className="w-5 h-5" />
          Home
        </a>
      </div>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="pt-20 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-playfair text-5xl md:text-6xl font-bold text-[#D4AF37] mb-4">
                Live Auction
              </h1>
              <p className="text-lg text-[#f5f5f5]/80 max-w-2xl mx-auto mb-6">
                Bid on exclusive experiences and items. All proceeds support Teach For Nepal&apos;s mission.
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block glass-strong px-8 py-4 rounded-lg"
              >
                <div className="text-sm text-[#f5f5f5]/60 mb-1">Current Total Raised</div>
                <div className="font-playfair text-3xl md:text-4xl font-bold text-[#D4AF37]">
                  {total === null ? "Loading..." : `NPR ${total.toLocaleString()}`}
                </div>
              </motion.div>
            </motion.div>

            {/* Leaderboard */}
            <AuctionLeaderboard />

            {/* Auction Items Grid */}
            <AuctionGrid />
          </div>
        </div>
      </main>
    </>
  );
}
