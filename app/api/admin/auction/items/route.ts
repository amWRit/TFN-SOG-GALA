import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/auction/items
 * Fetch all auction items (admin)
 */
export async function GET(request: Request) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const countOnly = searchParams.get('countOnly');

  if (countOnly) {
    const count = await prisma.auctionItem.count();
    return NextResponse.json({ count });
  }

  try {
    const items = await prisma.auctionItem.findMany({
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
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

/**
 * POST /api/admin/auction/items
 * Create a new auction item
 */
export async function POST(request: Request) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, imageUrl, startingBid, endTime, isActive } =
      body;

    const item = await prisma.auctionItem.create({
      data: {
        title,
        description: description || null,
        imageUrl: imageUrl || null,
        startingBid: startingBid || 0,
        currentBid: startingBid || 0,
        endTime: endTime ? new Date(endTime) : null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating auction item:", error);
    return NextResponse.json(
      { error: "Failed to create auction item" },
      { status: 500 }
    );
  }
}
