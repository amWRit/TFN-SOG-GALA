"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award, Flame } from "lucide-react";
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

// Visual order: 2nd (left), 1st (center), 3rd (right)
const PODIUM_ORDER = [1, 0, 2];

export function AuctionLeaderboard() {
  const { data: leaderboard, error } = useSWR<LeaderboardEntry[]>(
    "/api/auction/leaderboard",
    fetcher,
    { refreshInterval: 5000 }
  );

  if (error || !leaderboard || leaderboard.length === 0) return null;

  const topThree = leaderboard.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-20"
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
      <div className="flex items-end justify-center gap-4 md:gap-8">
        {PODIUM_ORDER.map((rankIdx) => {
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
              transition={{ delay: rankIdx * 0.1, duration: 0.4 }}
              className={`flex flex-col items-center ${cfg.scale}`}
            >
              {/* Card */}
              <div
                className="rounded-2xl text-center w-44 md:w-64 shadow-2xl relative overflow-hidden"
                style={{
                  background: cfg.bg,
                  border: `2px solid ${cfg.borderColor}`,
                }}
              >
                {/* Rank badge */}
                <div
                  className="absolute top-0 right-0 w-10 h-10 flex items-center justify-center rounded-bl-xl text-sm font-extrabold"
                  style={{ background: cfg.rankBg, color: cfg.rankText }}
                >
                  {rankIdx + 1}
                </div>

                <div className="p-6 md:p-8">
                  <Icon size={56} color={cfg.color} className="mx-auto mb-4" />
                  <div
                    className="font-bold text-base md:text-xl truncate mb-2"
                    style={{ color: "#084691" }}
                  >
                    {entry.bidderName}
                  </div>
                  <div
                    className="font-extrabold text-lg md:text-2xl"
                    style={{ color: cfg.color }}
                  >
                    NPR {entry.highestBid.toLocaleString()}
                  </div>
                  <div className="text-[#225898] text-sm mt-1.5">
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
