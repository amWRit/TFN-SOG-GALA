"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuctionItemCard } from "@/components/auction-item-card";
import useSWR from "swr";
import AuctionSkeleton from "./auction-skeleton";

interface AuctionItem {
  id: string;
  title: string;
  sequence: number;
  description: string | null;
  imageUrl: string | null;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endTime: Date | null;
  isActive: boolean;
}

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((data) => (Array.isArray(data) ? data : data.items ?? []));

export function AuctionGrid() {
  const { data: items, error, isLoading } = useSWR<AuctionItem[]>(
    "/api/auction/items",
    fetcher,
    {
      refreshInterval: 3000, // Refresh every 3 seconds for live updates
    }
  );

  if (isLoading) {
    return (
      <div className="relative z-10" style={{ padding: 32 }}>
        <AuctionSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Error loading auction items. Please refresh and try again.</p>
      </div>
    );
  }

  const activeItems = (items?.filter((item) => item.isActive) || []).sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  const inactiveItems = (items?.filter((item) => !item.isActive) || []).sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

  return (
    <div className="space-y-12">
      {/* Active Items */}
      {activeItems.length > 0 && (
        <div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-8 flex items-center justify-center gap-3">
            <span className="inline-block w-8 h-2 rounded-full bg-[#d71a21] animate-pulse" style={{ minWidth: 24, minHeight: 8, borderRadius: 6 }} />
            Bidding Open
            <span className="inline-block w-8 h-2 rounded-full bg-[#d71a21] animate-pulse" style={{ minWidth: 24, minHeight: 8, borderRadius: 6 }} />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AuctionItemCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Inactive/Closed Items */}
      {inactiveItems.length > 0 && (
        <div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white/60 mb-8 text-center">
            Auction Closed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inactiveItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <AuctionItemCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {items?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-white/70">No auction items available at this time.</p>
        </div>
      )}
    </div>
  );
}
