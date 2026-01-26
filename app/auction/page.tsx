"use client";
import Navbar from "@/components/navbar";
import { AuctionGrid } from "@/components/auction-grid";
import { AuctionLeaderboard } from "@/components/auction-leaderboard";
import { motion } from "framer-motion";

export default function AuctionPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
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
                $25,000
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
  );
}
