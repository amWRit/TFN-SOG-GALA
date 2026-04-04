"use client";

import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { AuctionLeaderboard } from "@/components/auction-leaderboard";
import { AuctionItemsSummary } from "@/components/auction-items-summary";
import ProgressSkeleton from "@/components/progress-skeleton";
import NotFound from "@/components/NotFound";

export default function LeaderboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setIsAdmin(data.authenticated === true);
      setChecking(false);
    }
    checkAdmin();
  }, [router]);

  if (checking) return <ProgressSkeleton />;
  if (!isAdmin) return <NotFound />;

  return (
    <div className="min-h-screen bg-[#07122b] flex flex-col items-center px-4 py-8">
      {/* Home button */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <a
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-full shadow-lg font-semibold hover:bg-white transition-all border border-gray-200"
        >
          <Home size={20} />
          Home
        </a>
      </div>

      <div className="w-full max-w-5xl pt-16">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 text-center">
          Auction Leaderboard
        </h1>
        <h2 className="text-lg md:text-2xl text-yellow-400 font-semibold text-center mb-10">
          ---
        </h2>

        <AuctionLeaderboard />
        <AuctionItemsSummary />
      </div>
    </div>
  );
}
