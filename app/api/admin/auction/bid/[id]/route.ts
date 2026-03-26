import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/admin/auction/bid/[id]
 * Delete a bid by ID (admin only)
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!id) {
    return NextResponse.json({ error: "Missing bid ID" }, { status: 400 });
  }
  try {
    // Find the bid to get auctionItemId
    const bid = await prisma.bid.findUnique({ where: { id } });
    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }
    const auctionItemId = bid.auctionItemId;

    // Delete the bid
    const deleted = await prisma.bid.delete({ where: { id } });

    // Find the highest remaining bid for this item
    const topBid = await prisma.bid.findFirst({
      where: { auctionItemId },
      orderBy: { amount: "desc" },
    });

    if (topBid) {
      // Update auction item with new highest bid
      await prisma.auctionItem.update({
        where: { id: auctionItemId },
        data: {
          currentBid: topBid.amount,
          currentBidder: topBid.bidderName,
        },
      });
    } else {
      // No bids left, reset to startingBid/null
      const item = await prisma.auctionItem.findUnique({ where: { id: auctionItemId } });
      if (item) {
        await prisma.auctionItem.update({
          where: { id: auctionItemId },
          data: {
            currentBid: 0,
            currentBidder: null,
          },
        });
      }
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("Error deleting bid:", error);
    return NextResponse.json({ error: "Failed to delete bid" }, { status: 500 });
  }
}
