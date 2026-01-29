import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/auction/items/bid
 * Public endpoint to place a bid on an auction item
 * Body: { auctionItemId: string, amount: number, bidderName: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auctionItemId, amount, bidderName } = body;

    if (!auctionItemId || !amount || !bidderName || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Fetch the auction item
    const item = await prisma.auctionItem.findUnique({ where: { id: auctionItemId } });
    if (!item || !item.isActive) {
      return NextResponse.json({ error: "Auction item not found or not active" }, { status: 404 });
    }
    if (item.endTime && new Date(item.endTime).getTime() <= new Date().getTime()) {
      return NextResponse.json({ error: "Auction is closed" }, { status: 400 });
    }
    if (amount <= item.currentBid) {
      return NextResponse.json({ error: "Bid must be higher than current bid" }, { status: 400 });
    }

    // Create bid record
    const bid = await prisma.bid.create({
      data: {
        auctionItemId,
        bidderName,
        amount,
      },
    });

    // Update auction item current bid
    await prisma.auctionItem.update({
      where: { id: auctionItemId },
      data: {
        currentBid: amount,
        currentBidder: bidderName,
      },
    });

    return NextResponse.json({ success: true, bid });
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }
}
