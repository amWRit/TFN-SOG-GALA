"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import useSWR from "swr";

interface LeaderboardEntry {
  bidderName: string;
  totalBids: number;
  highestBid: number;
  itemCount: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AuctionLeaderboard() {
  const { data: leaderboard, error } = useSWR<LeaderboardEntry[]>(
    "/api/auction/leaderboard",
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds
    }
  );

  if (error || !leaderboard || leaderboard.length === 0) {
    return null; // Don't show leaderboard if no data
  }

  const topThree = leaderboard.slice(0, 3);
  const icons = [Trophy, Medal, Award];
  const colors = ["#D4AF37", "#C0C0C0", "#CD7F32"]; // Gold, Silver, Bronze

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#D4AF37] mb-8 text-center">
        Top Bidders
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {topThree.map((entry, index) => {
          const Icon = icons[index];
          return (
            <motion.div
              key={entry.bidderName}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${index === 0 ? "order-2 md:order-1" : index === 1 ? "order-1 md:order-2" : "order-3"}`}
            >
              <Card
                className={`glass-strong p-6 text-center min-w-[200px] ${
                  index === 0 ? "scale-110" : ""
                }`}
              >
                <div className="flex justify-center mb-4">
                  <Icon size={48} color={colors[index]} />
                </div>
                <div className="font-playfair text-xl font-bold text-[#D4AF37] mb-2">
                  {entry.bidderName}
                </div>
                <div className="text-sm text-[#f5f5f5]/80">
                  <div>${entry.highestBid.toLocaleString()} highest</div>
                  <div>{entry.itemCount} items</div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
