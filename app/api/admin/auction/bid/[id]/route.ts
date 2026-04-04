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

/**
 * PATCH /api/admin/auction/bid/[id]
 * Edit a bid's amount and/or bidder name (admin only)
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { amount?: number; bidderName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { amount, bidderName } = body;

  if (amount === undefined || isNaN(Number(amount)) || Number(amount) <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const newAmount = Number(amount);

  try {
    const bid = await prisma.bid.findUnique({ where: { id } });
    if (!bid) {
      return NextResponse.json({ error: "Bid not found" }, { status: 404 });
    }

    const auctionItemId = bid.auctionItemId;

    // Check auction is still active
    const auctionItem = await prisma.auctionItem.findUnique({ where: { id: auctionItemId } });
    if (!auctionItem) {
      return NextResponse.json({ error: "Auction item not found" }, { status: 404 });
    }
    if (!auctionItem.isActive || (auctionItem.endTime && new Date(auctionItem.endTime) <= new Date())) {
      return NextResponse.json({ error: "Auction is closed. Cannot edit bids." }, { status: 400 });
    }

    // Get all bids sorted chronologically (oldest first)
    const allBids = await prisma.bid.findMany({
      where: { auctionItemId },
      orderBy: { createdAt: "asc" },
    });

    const index = allBids.findIndex(b => b.id === id);
    const prevBid = index > 0 ? allBids[index - 1] : null;
    const nextBid = index < allBids.length - 1 ? allBids[index + 1] : null;

    if (prevBid && newAmount <= prevBid.amount) {
      return NextResponse.json(
        { error: `Bid must be greater than the previous bid of NPR ${prevBid.amount.toLocaleString()}` },
        { status: 400 }
      );
    }

    if (nextBid && newAmount >= nextBid.amount) {
      return NextResponse.json(
        { error: `Bid must be less than the next bid of NPR ${nextBid.amount.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Update the bid
    const updated = await prisma.bid.update({
      where: { id },
      data: {
        amount: newAmount,
        ...(bidderName !== undefined ? { bidderName: bidderName || "NA" } : {}),
      },
    });

    // Recalculate current bid (highest amount wins)
    const topBid = await prisma.bid.findFirst({
      where: { auctionItemId },
      orderBy: { amount: "desc" },
    });

    if (topBid) {
      await prisma.auctionItem.update({
        where: { id: auctionItemId },
        data: {
          currentBid: topBid.amount,
          currentBidder: topBid.bidderName,
        },
      });
    }

    return NextResponse.json({ success: true, bid: updated });
  } catch (error) {
    console.error("Error editing bid:", error);
    return NextResponse.json({ error: "Failed to edit bid" }, { status: 500 });
  }
}
