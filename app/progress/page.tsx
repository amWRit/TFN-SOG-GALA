"use client";

import React, { useEffect, useRef, useState } from "react";
import ProgressSkeleton from "@/components/progress-skeleton";
import { Home, CheckCircle, Clock, Loader, PartyPopper } from "lucide-react";
import styles from "../../styles/progress.module.css";
import { useRouter } from "next/navigation";
import NotFound from "@/components/NotFound";
import FallingConfetti from "@/components/FallingConfetti";
import ThankYouCard from "@/components/ThankYouCard";
import PopperConfetti from "@/components/PopperConfetti";

interface FundraisingSummary {
  galaYear: number;
  targetAmount: number;
  preAuctionTotal: number;
  ticketSalesTotal: number;
  programSupportTotal: number;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [popTrigger, setPopTrigger] = useState(0);
  const prevTotalRaisedRef = useRef<number | null>(null);
  const tadaRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  // Pre-create and unlock audio on first user interaction so the browser
  // allows programmatic .play() calls that originate from polling intervals.
  useEffect(() => {
    const audio = new Audio("/audio/tada.mp3");
    audio.preload = "auto";
    tadaRef.current = audio;
    const unlock = () => {
      audio.muted = true;
      audio.play().then(() => {
        audio.pause();
        audio.muted = false;
        audio.currentTime = 0;
      }).catch(() => {});
    };
    document.addEventListener("click", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    async function checkAdmin() {
      const res = await fetch("/api/admin/session");
      const data = await res.json();
      setIsAdmin(data.authenticated === true);
      setCheckingAdmin(false);
    }
    checkAdmin();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    let interval: NodeJS.Timeout;
    const fetchSummary = async () => {
      setLoading(true);
      const res = await fetch("/api/fundraising/summary");
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
        if (prevTotalRaisedRef.current !== null && data.totalRaised > prevTotalRaisedRef.current) {
          setPopTrigger((t) => t + 1);
          if (tadaRef.current) {
            tadaRef.current.currentTime = 0;
            tadaRef.current.play().catch(() => {});
          }
        }
        prevTotalRaisedRef.current = data.totalRaised;
      }
      setLoading(false);
    };
    fetchSummary();
    interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  if (checkingAdmin) return <ProgressSkeleton />;
  if (!isAdmin) return <NotFound />;
  if (loading && !summary) return <ProgressSkeleton />;
  if (!summary) return <div className="text-center text-red-500">No data available</div>;

  const {
    galaYear,
    targetAmount,
    preAuctionTotal,
    ticketSalesTotal,
    programSupportTotal,
    auctionTotal,
    totalRaised,
    percentOfGoal,
    goalReached,
    itemsSold,
    highestBid,
    itemsRemaining,
  } = summary;

  // Bar fill calculations — three stacked segments
  const ticketPercent = Math.min(100, (ticketSalesTotal / targetAmount) * 100);
  const programPercent = Math.min(100, (programSupportTotal / targetAmount) * 100);
  const auctionPercent = Math.min(100 - ticketPercent - programPercent, (auctionTotal / targetAmount) * 100);

  return (
    <div className="min-h-screen bg-[#07122b] flex flex-col items-center justify-start px-4 pt-15 pb-8">
      {goalReached && <FallingConfetti />}
      <PopperConfetti trigger={popTrigger} />
      {/* Home Button */}
      {/* <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <a href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-full shadow-lg font-semibold hover:bg-white transition-all border border-gray-200">
          <Home size={20} className="w-5 h-5" />
          Home
        </a>
      </div> */}
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 text-center">
          Truth & Hope Gala {galaYear}
        </h1>
        <h2 className="text-lg md:text-2xl text-yellow-400 font-semibold text-center mb-10">
          Fundraising Progress
        </h2>
        {/* Goal */}
        <div className="flex flex-col items-center mb-10">
          <span className="uppercase text-xl tracking-widest text-yellow-600 font-semibold mb-1">Goal</span>
          <span className="text-5xl md:text-7xl font-bold text-yellow-400 tracking-tight animate-pulse">
            NPR {targetAmount.toLocaleString()}
          </span>
        </div>
        {/* Progress */}
        <div className="flex flex-col items-center mb-10">
          <span className="uppercase text-xl tracking-widest text-gray-200 font-semibold mb-1">Raised</span>
          <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            NPR {totalRaised.toLocaleString()}
          </span>
          <span className="text-xl md:text-2xl font-bold text-yellow-400 tracking-light mt-2">
            {percentOfGoal}% of goal reached
          </span>
        </div>
        {/* Still Needed / Above & Beyond */}
        <div className="flex flex-col items-center mb-10">
          {goalReached ? (
            <>
              <PartyPopper className="text-yellow-400 w-5 h-5 mb-1 animate-bounce" />
              <span className="uppercase text-xl tracking-widest text-green-400 font-semibold mb-1">Above &amp; Beyond</span>
              <span className="text-5xl md:text-6xl font-bold text-yellow-300 animate-bounce">
                +NPR {(totalRaised - targetAmount).toLocaleString()}
              </span>
            </>
          ) : (
            <>
              <span className="uppercase text-xl tracking-widest text-gray-200 font-semibold mb-1">Still Needed</span>
              <span className="text-5xl md:text-6xl font-bold text-white animate-bounce">
                NPR {(targetAmount - totalRaised).toLocaleString()}
              </span>
            </>
          )}
        </div>
        {/* Progress Bar */}
        <div className="relative w-full h-10 rounded-full bg-[#1a2540] overflow-hidden mb-4 border-2 border-[#22305a]">
          {/* Ticket Sales segment */}
          <div
            className="absolute left-0 top-0 h-full bg-blue-600"
            style={{ width: `${ticketPercent}%` }}
          />
          {/* Program Support segment */}
          <div
            className="absolute top-0 h-full bg-purple-500"
            style={{ left: `${ticketPercent}%`, width: `${programPercent}%` }}
          />
          {/* Auction Tonight segment */}
          <div
            className="absolute top-0 h-full bg-red-600"
            style={{ left: `${ticketPercent + programPercent}%`, width: `${auctionPercent}%` }}
          />
          {/* Glass swipe effect */}
          <div className={styles["glass-swipe"]} />
          {/* Gold goal marker */}
          <div
            className="absolute top-0 h-full border-l-4 border-yellow-400"
            style={{ left: `calc(${Math.min(100, 100)}% - 2px)` }}
          />
        </div>

        {/* Bar labels */}
        <div className="w-full mb-8">
          <div className="flex flex-wrap justify-between gap-y-2 text-white text-sm font-medium">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 inline-block rounded bg-blue-600" /> Ticket Sales
              <span className="font-bold ml-1">NPR {ticketSalesTotal.toLocaleString()}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 inline-block rounded bg-purple-500" /> Program Support
              <span className="font-bold ml-1">NPR {programSupportTotal.toLocaleString()}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 inline-block rounded bg-red-600" /> Auction Tonight
              <span className="font-bold ml-1">NPR {auctionTotal.toLocaleString()}</span>
            </span>
            {/* <span className="flex items-center gap-2">
              <span className="w-4 h-4 inline-block rounded bg-yellow-400" /> Goal
              <span className="font-bold ml-1">NPR {targetAmount.toLocaleString()}</span>
            </span> */}
          </div>
        </div>
        {/* Stat Row */}
        <div className="text-center mb-2">
          <span className="uppercase text-xs tracking-widest text-white-500 font-semibold">Auction Details</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center bg-[#101b36] rounded-lg py-4 px-2 md:px-4 lg:px-6">
          <div className="flex flex-col items-center justify-center min-h-[80px]">
            <CheckCircle className="text-green-400 w-5 h-5 mb-1" />
            <span className="text-3xl md:text-4xl font-bold text-white">{itemsSold}</span>
            <div className="uppercase text-xs text-gray-400 mt-1">Items Sold</div>
          </div>
          <div className="flex flex-col items-center justify-center min-h-[80px]">
            <Loader className="text-blue-400 w-5 h-5 mb-1" />
            <span className="text-3xl md:text-4xl font-bold text-white">{itemsRemaining}</span>
            <div className="uppercase text-xs text-gray-400 mt-1">Items Remaining</div>
          </div>
        </div>

        {/* Thank You Card */}
        {goalReached && <ThankYouCard />}
      </div>
    </div>
  );
}
