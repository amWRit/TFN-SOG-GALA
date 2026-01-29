"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuctionItemCard } from "@/components/auction-item-card";
import useSWR from "swr";

interface AuctionItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endTime: Date | null;
  isActive: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-400"></div>
        <p className="mt-4 text-gray-200">Loading auction items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Error loading auction items. Please try again later.</p>
      </div>
    );
  }

  const activeItems = items?.filter((item) => item.isActive) || [];
  const inactiveItems = items?.filter((item) => !item.isActive) || [];

  return (
    <div className="space-y-12">
      {/* Active Items */}
      {activeItems.length > 0 && (
        <div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-8">
            Bidding Now Open
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-pink-300 mb-8">
            Auction Closed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <p className="text-gray-200">No auction items available at this time.</p>
        </div>
      )}
    </div>
  );
}
