import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/auction/leaderboard
 * Get top bidders leaderboard
 */
export async function GET() {
  try {
    const bids = await prisma.bid.findMany({
      include: {
        auctionItem: true,
      },
    });

    // Aggregate by bidder
    const bidderStats: {
      [key: string]: {
        bidderName: string;
        totalBids: number;
        highestBid: number;
        itemCount: number;
      };
    } = {};

    bids.forEach((bid) => {
      if (!bidderStats[bid.bidderName]) {
        bidderStats[bid.bidderName] = {
          bidderName: bid.bidderName,
          totalBids: 0,
          highestBid: 0,
          itemCount: 0,
        };
      }

      bidderStats[bid.bidderName].totalBids += bid.amount;
      if (bid.amount > bidderStats[bid.bidderName].highestBid) {
        bidderStats[bid.bidderName].highestBid = bid.amount;
      }
    });

    // Count unique items per bidder
    const itemCounts: { [key: string]: Set<string> } = {};
    bids.forEach((bid) => {
      if (!itemCounts[bid.bidderName]) {
        itemCounts[bid.bidderName] = new Set();
      }
      itemCounts[bid.bidderName].add(bid.auctionItemId);
    });

    Object.keys(bidderStats).forEach((bidder) => {
      bidderStats[bidder].itemCount = itemCounts[bidder]?.size || 0;
    });

    const leaderboard = Object.values(bidderStats)
      .sort((a, b) => b.highestBid - a.highestBid)
      .slice(0, 10);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
