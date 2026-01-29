import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Sum of payment from registration table
  const registrationSum = await prisma.registration.aggregate({
    _sum: { payment: true },
  });
  // Sum of currentBid from auction items that are completed (isActive: false)
  const auctionSum = await prisma.auctionItem.aggregate({
    _sum: { currentBid: true },
    where: { isActive: false },
  });
  const total = (registrationSum._sum.payment || 0) + (auctionSum._sum.currentBid || 0);
  return NextResponse.json({
    registration: registrationSum._sum.payment || 0,
    auction: auctionSum._sum.currentBid || 0,
    total,
  });
}
