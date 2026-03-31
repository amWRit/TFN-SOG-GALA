"use client";

import React, { useEffect, useState } from "react";

interface FundraisingSummary {
  galaYear: number;
  targetAmount: number;
  preAuctionTotal: number;
  auctionTotal: number;
  totalRaised: number;
  percentOfGoal: number;
  goalReached: boolean;
  itemsSold: number;
  highestBid: number;
  itemsRemaining: number;
}

export default function ProgressPage() {
  const [summary, setSummary] = useState<FundraisingSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchSummary = async () => {
      setLoading(true);
      const res = await fetch("/api/fundraising/summary");
      if (res.ok) {
        setSummary(await res.json());
      }
      setLoading(false);
    };
    fetchSummary();
    interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !summary) return <div className="text-center text-white">Loading...</div>;
  if (!summary) return <div className="text-center text-red-500">No data available</div>;

  const {
    galaYear,
    targetAmount,
    preAuctionTotal,
    auctionTotal,
    totalRaised,
    percentOfGoal,
    goalReached,
    itemsSold,
    highestBid,
    itemsRemaining,
  } = summary;

  // Bar fill calculations
  const preAuctionPercent = Math.min(100, (preAuctionTotal / targetAmount) * 100);
  const auctionPercent = Math.min(100, (auctionTotal / targetAmount) * 100);

  return (
    <div className="min-h-screen bg-[#07122b] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 text-center">
          Truth & Hope Gala {galaYear}
        </h1>
        <h2 className="text-lg md:text-2xl text-yellow-400 font-semibold text-center mb-8">
          Fundraising Progress
        </h2>
        <div className="flex flex-col items-center mb-6">
          <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            NPR {totalRaised.toLocaleString()}
          </span>
          <span className="text-2xl md:text-3xl font-bold text-yellow-400 mt-2">
            {percentOfGoal}% of goal
          </span>
        </div>
        {/* Progress Bar */}
        <div className="relative w-full h-10 rounded-full bg-[#1a2540] overflow-hidden mb-4 border-2 border-[#22305a]">
          {/* Pre-auction fill */}
          <div
            className="absolute left-0 top-0 h-full bg-blue-600"
            style={{ width: `${preAuctionPercent}%` }}
          />
          {/* Auction fill (striped) */}
          <div
            className="absolute left-0 top-0 h-full"
            style={{
              width: `${preAuctionPercent + auctionPercent}%`,
              background:
                auctionTotal > 0
                  ?
                    `repeating-linear-gradient(135deg, #e3342f 0 10px, #e3342f 0 20px, #b91c1c 0 30px, #b91c1c 0 40px)`
                  : "none",
              clipPath: `inset(0 ${100 - (preAuctionPercent + auctionPercent)}% 0 0)`
            }}
          />
          {/* Gold goal marker */}
          <div
            className="absolute top-0 h-full border-l-4 border-yellow-400"
            style={{ left: `calc(${Math.min(100, 100)}% - 2px)` }}
          />
        </div>
        {/* Bar labels */}
        <div className="flex justify-between text-white text-sm md:text-base font-medium mb-8">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 inline-block rounded bg-blue-600" /> Pre-auction
            <span className="font-bold ml-2">NPR {preAuctionTotal.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 inline-block rounded bg-red-600" /> Auction tonight
            <span className="font-bold ml-2">NPR {auctionTotal.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 inline-block rounded bg-yellow-400" /> Goal
            <span className="font-bold ml-2">NPR {targetAmount.toLocaleString()}</span>
          </span>
        </div>
        {/* Stat Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-8 bg-[#101b36] rounded-lg py-6">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">{itemsSold}</div>
            <div className="uppercase text-xs text-gray-400 mt-1">Items Sold</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-yellow-400">NPR {highestBid.toLocaleString()}</div>
            <div className="uppercase text-xs text-gray-400 mt-1">Highest Bid</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">{itemsRemaining}</div>
            <div className="uppercase text-xs text-gray-400 mt-1">Items Remaining</div>
          </div>
          <div>
            <div className={`text-2xl md:text-3xl font-bold ${goalReached ? "text-red-400" : "text-yellow-400"}`}>
              {goalReached ? "Goal reached!" : `NPR ${(targetAmount - totalRaised).toLocaleString()}`}
            </div>
            <div className="uppercase text-xs text-gray-400 mt-1">
              {goalReached ? "To reach goal" : "To reach goal"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
