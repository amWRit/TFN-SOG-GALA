import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/admin/auction/bid/clear?itemId=xxx
 * Delete all bids for a given auction item (admin only)
 */
export async function DELETE(request: Request) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) {
    return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
  }
  try {
    // Delete all bids for this item
    const deleted = await prisma.bid.deleteMany({ where: { auctionItemId: itemId } });

    // Reset auction item's currentBid/currentBidder to 0/null
    await prisma.auctionItem.update({
      where: { id: itemId },
      data: {
        currentBid: 0,
        currentBidder: null,
      },
    });

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("Error clearing bids:", error);
    return NextResponse.json({ error: "Failed to clear bids" }, { status: 500 });
  }
}
