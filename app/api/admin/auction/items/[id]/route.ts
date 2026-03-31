import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * PUT /api/admin/auction/items/[id]
 * Update an auction item
 */

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, imageUrl, startingBid, endTime, isActive, patron, actualPrice } = body;
    const { id } = await context.params;
    let soldPriceUpdate = {};
    if (isActive === false) {
      // Find highest bid for this item
      const topBid = await prisma.bid.findFirst({
        where: { auctionItemId: id },
        orderBy: { amount: "desc" },
      });
      soldPriceUpdate = { soldPrice: topBid ? topBid.amount : 0 };
    }
    const item = await prisma.auctionItem.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(startingBid !== undefined && { startingBid }),
        ...(endTime !== undefined && { endTime: endTime ? new Date(endTime) : null }),
        ...(isActive !== undefined && { isActive }),
        ...(patron !== undefined && { patron }),
        ...(actualPrice !== undefined && { actualPrice }),
        ...soldPriceUpdate,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating auction item:", error);
    return NextResponse.json(
      { error: "Failed to update auction item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    await prisma.auctionItem.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting auction item:", error);
    return NextResponse.json(
      { error: "Failed to delete auction item" },
      { status: 500 }
    );
  }
}
