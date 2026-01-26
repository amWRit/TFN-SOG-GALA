import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/auction/items
 * Fetch all auction items
 */
export async function GET() {
  try {
    const items = await prisma.auctionItem.findMany({
      include: {
        bids: {
          orderBy: { createdAt: "desc" },
          take: 10, // Latest 10 bids
        },
      },
      orderBy: [
        { isActive: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching auction items:", error);
    return NextResponse.json(
      { error: "Failed to fetch auction items" },
      { status: 500 }
    );
  }
}
