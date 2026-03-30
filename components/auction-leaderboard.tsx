"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award, Flame } from "lucide-react";
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
    bg: "#fffbeb",
    label: "1st",
    podiumH: "h-24",
    podiumBg: "#fef3c7",
    scale: "scale-110",
    rankBg: "#D4AF37",
    rankText: "#000",
  },
  {
    icon: Medal,
    color: "#8e8e8e",
    borderColor: "#C0C0C0",
    bg: "#f5f5f5",
    label: "2nd",
    podiumH: "h-16",
    podiumBg: "#ebebeb",
    scale: "",
    rankBg: "#C0C0C0",
    rankText: "#000",
  },
  {
    icon: Award,
    color: "#CD7F32",
    borderColor: "#CD7F32",
    bg: "#fff5ee",
    label: "3rd",
    podiumH: "h-10",
    podiumBg: "#fde8d8",
    scale: "",
    rankBg: "#CD7F32",
    rankText: "#000",
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

  // ── All hooks must be called unconditionally before any early returns ──
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Derived values — safe to compute before the early return since they
  // don't call any hooks themselves
  const topThree = leaderboard?.slice(0, 3) ?? [];
  const podiumOrder = isMobile ? PODIUM_ORDER_MOBILE : PODIUM_ORDER_SM;

  if (error || !leaderboard || leaderboard.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-2">
        <span className="text-gray-500 text-base font-semibold text-center">
          Leaderboard not available yet
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className=""
    >
      {/* Section header */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Flame size={22} color="#D4AF37" />
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#084691]">
            Top Bidders
          </h2>
          <Flame size={22} color="#D4AF37" />
        </div>
        <div className="w-20 h-0.5 bg-[#D4AF37]" />
      </div>

      {/* Podium */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full pb-4">
        {podiumOrder.map((rankIdx, i) => {
          const entry = topThree[rankIdx];
          if (!entry) return null;
          const cfg = PODIUM_CONFIG[rankIdx];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={entry.bidderName}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`flex flex-col items-center w-56 md:w-64 ${cfg.scale}`}
            >
              {/* Card */}
              <div
                className="rounded-2xl text-center w-56 md:w-64 shadow-2xl relative overflow-hidden"
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

                <div className="p-4 sm:p-6 md:p-8">
                  <Icon size={40} className="mx-auto mb-3 sm:mb-4" color={cfg.color} />
                  <div
                    className="font-bold text-sm sm:text-base md:text-xl truncate mb-2"
                    style={{ color: "#084691" }}
                  >
                    {entry.bidderName}
                  </div>
                  <div
                    className="font-extrabold text-base sm:text-lg md:text-2xl"
                    style={{ color: cfg.color }}
                  >
                    NPR {entry.highestBid.toLocaleString()}
                  </div>
                  <div className="text-[#225898] text-xs sm:text-sm mt-1.5">
                    {entry.itemCount} item{entry.itemCount !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}