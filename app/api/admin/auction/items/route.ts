import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/auction/items
 * Fetch all auction items (admin)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countOnly = searchParams.get('countOnly');

  if (countOnly) {
    const count = await prisma.auctionItem.count();
    return NextResponse.json({ count });
  }

  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sequenceAudit = await prisma.auctionItem.findMany({
      select: { id: true, sequence: true, createdAt: true },
      orderBy: [{ sequence: "asc" }, { createdAt: "asc" }],
    });

    const hasMissingSequence = sequenceAudit.some((item) => !item.sequence || item.sequence <= 0);
    if (hasMissingSequence) {
      const normalizedOrder = [...sequenceAudit].sort((a, b) => {
        if (a.sequence > 0 && b.sequence > 0) {
          if (a.sequence !== b.sequence) return a.sequence - b.sequence;
          return a.createdAt.getTime() - b.createdAt.getTime();
        }
        if (a.sequence > 0) return -1;
        if (b.sequence > 0) return 1;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });

      await prisma.$transaction(
        normalizedOrder.map((item, index) =>
          prisma.auctionItem.update({
            where: { id: item.id },
            data: { sequence: index + 1 },
          })
        )
      );
    }

    const items = await prisma.auctionItem.findMany({
      orderBy: [{ sequence: "asc" }, { createdAt: "asc" }],
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
    const { title, description, imageUrl, startingBid, endTime, isActive, patron, actualPrice } = body;

    const maxSequence = await prisma.auctionItem.aggregate({
      _max: { sequence: true },
    });
    const nextSequence = (maxSequence._max.sequence ?? 0) + 1;

    const item = await prisma.auctionItem.create({
      data: {
        title,
        sequence: nextSequence,
        description: description || null,
        imageUrl: imageUrl || null,
        startingBid: startingBid || 0,
        currentBid: 0,
        endTime: endTime ? new Date(endTime) : null,
        isActive: isActive !== undefined ? isActive : true,
        patron: patron || null,
        actualPrice: actualPrice !== undefined ? actualPrice : 0,
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

/**
 * PATCH /api/admin/auction/items
 * Update sequence ordering of auction items
 */
export async function PATCH(request: Request) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { order } = body;

    if (!Array.isArray(order)) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    await prisma.$transaction(
      order.map((entry: { id: string; sequence: number }) =>
        prisma.auctionItem.update({
          where: { id: entry.id },
          data: { sequence: entry.sequence },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating auction item sequence:", error);
    return NextResponse.json(
      { error: "Failed to update auction sequence" },
      { status: 500 }
    );
  }
}
