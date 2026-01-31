import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/auction/items/[id]/bids
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Next.js 14+ dynamic API routes: context.params may be a Promise
    const params = await context.params;
    const { id } = params;
    const bids = await prisma.bid.findMany({
      where: { auctionItemId: id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        bidderName: true,
      }
    });
    return NextResponse.json({
      bids: bids.map(bid => ({
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.createdAt,
        bidderName: bid.bidderName || "Anonymous"
      }))
    });
  } catch (error) {
    console.error("Error fetching bid history:", error);
    return NextResponse.json(
      { error: "Failed to fetch bid history" },
      { status: 500 }
    );
  }
}
