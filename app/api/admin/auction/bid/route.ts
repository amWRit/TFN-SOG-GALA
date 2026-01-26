import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/auction/bid
 * Create a bid (admin only - for manual bid entry)
 */
export async function POST(request: Request) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { auctionItemId, amount, bidderName } = body;

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

    return NextResponse.json(bid);
  } catch (error) {
    console.error("Error creating bid:", error);
    return NextResponse.json(
      { error: "Failed to create bid" },
      { status: 500 }
    );
  }
}
