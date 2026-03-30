import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Sum of payment from registration table
  const registrationSum = await prisma.registration.aggregate({
    _sum: { payment: true },
    where: { paymentStatus: true },
  });

  // Get all completed auction items
  const completedItems = await prisma.auctionItem.findMany({
    where: { isActive: false },
    select: { id: true },
  });

  // For each completed item, get the highest bid (if any)
  let auctionTotal = 0;
  for (const item of completedItems) {
    const highestBid = await prisma.bid.findFirst({
      where: { auctionItemId: item.id },
      orderBy: { amount: "desc" },
      select: { amount: true },
    });
    if (highestBid) {
      auctionTotal += highestBid.amount;
    }
  }

  const total = (registrationSum._sum.payment || 0) + auctionTotal;
  return NextResponse.json({
    registration: registrationSum._sum.payment || 0,
    auction: auctionTotal,
    total,
  });
}
