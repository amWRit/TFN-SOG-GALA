"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Star, User } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface LeaderboardEntry {
  bidderName: string;
  totalBids: number;
  highestBid: number;
  itemCount: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const PODIUM_CONFIG = [
  {
    icon: Trophy,
    color: "#D4AF37",
    borderColor: "#D4AF37",
    bg: "rgba(212,175,55,0.10)",
    scale: "scale-110",
    rankBg: "#D4AF37",
    rankText: "#000",
  },
  {
    icon: Star,
    color: "#C0C0C0",
    borderColor: "#C0C0C0",
    bg: "rgba(192,192,192,0.08)",
    scale: "",
    rankBg: "#C0C0C0",
    rankText: "#000",
  },
  {
    icon: Star,
    color: "#CD7F32",
    borderColor: "#CD7F32",
    bg: "rgba(205,127,50,0.10)",
    scale: "",
    rankBg: "#CD7F32",
    rankText: "#fff",
  },
];

// Visual order: 2nd (left), 1st (center), 3rd (right) for sm+, 1st, 2nd, 3rd for mobile
const PODIUM_ORDER_SM = [1, 0, 2];
const PODIUM_ORDER_MOBILE = [0, 1, 2];

export function AuctionLeaderboard() {
  const { data: leaderboard, error } = useSWR<LeaderboardEntry[]>(
    "/api/auction/leaderboard",
    fetcher,
    { refreshInterval: 5000 }
  );

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const topThree = leaderboard?.slice(0, 3) ?? [];
  const rest = leaderboard?.slice(3) ?? [];
  const podiumOrder = isMobile ? PODIUM_ORDER_MOBILE : PODIUM_ORDER_SM;

  if (error || !leaderboard || leaderboard.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <span className="text-gray-500 text-base font-semibold text-center">
          Leaderboard not available yet
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Section header */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Flame size={22} color="#D4AF37" />
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-yellow-400">
            Top Bidders
          </h2>
          <Flame size={22} color="#D4AF37" />
        </div>
        <div className="w-20 h-0.5 bg-[#D4AF37]" />
      </div>

      {/* Podium */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-4 sm:gap-6 md:gap-8 w-full pb-6">
        {podiumOrder.map((rankIdx, i) => {
          const entry = topThree[rankIdx];
          if (!entry) return null;
          const cfg = PODIUM_CONFIG[rankIdx];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={entry.bidderName}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className={`flex flex-col items-center w-56 md:w-72 ${cfg.scale}`}
            >
              <div
                className="rounded-2xl text-center w-full shadow-2xl relative overflow-hidden"
                style={{
                  background: cfg.bg,
                  border: `2px solid ${cfg.borderColor}`,
                }}
              >
                {/* Rank badge */}
                <div
                  className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center rounded-bl-xl text-xs sm:text-sm font-extrabold"
                  style={{ background: cfg.rankBg, color: cfg.rankText }}
                >
                  {rankIdx + 1}
                </div>

                <div className="p-5 sm:p-6 md:p-8">
                  <Icon size={38} className="mx-auto mb-3" color={cfg.color} />
                  <div className="font-bold text-sm sm:text-base md:text-lg truncate mb-2 text-white">
                    {entry.bidderName}
                  </div>
                  <div
                    className="font-extrabold text-base sm:text-lg md:text-2xl"
                    style={{ color: cfg.color }}
                  >
                    NPR {entry.highestBid.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm mt-1.5">
                    {entry.itemCount} item{entry.itemCount !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Ranks 4+ */}
      {rest.length > 0 && (
        <div className="mt-6 rounded-xl overflow-hidden border border-white/10 bg-[#101b36]">
          {rest.map((entry, i) => (
            <motion.div
              key={entry.bidderName}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
              className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
            >
              <span className="w-7 text-center font-bold text-gray-500 text-sm shrink-0">
                {i + 4}
              </span>
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="flex-1 text-white font-semibold truncate">
                {entry.bidderName}
              </span>
              <span className="font-playfair font-bold text-yellow-400">
                NPR {entry.highestBid.toLocaleString()}
              </span>
              <span className="text-gray-500 text-xs w-20 text-right shrink-0">
                {entry.itemCount} item{entry.itemCount !== 1 ? "s" : ""}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}