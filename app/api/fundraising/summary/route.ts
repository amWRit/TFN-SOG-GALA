import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Returns fundraising progress summary for the progress page
export async function GET() {
  // Get gala config (assume only one row for current gala)
  const galaConfig = await prisma.galaConfig.findFirst({
    orderBy: { galaYear: "desc" },
  });

  // Defensive fallback
  if (!galaConfig) {
    return NextResponse.json({ error: "No gala config found" }, { status: 404 });
  }

  // Pre-auction total from config
  const targetAmount = galaConfig.targetAmount || 0;

  // Pre-auction breakdown by category
  const preAuctionEntries = await prisma.preAuctionEntry.groupBy({
    by: ["category"],
    where: { galaYear: galaConfig.galaYear },
    _sum: { amount: true },
  });

  const ticketSalesTotal =
    preAuctionEntries.find((e) => e.category === "Ticket Sales")?._sum.amount ?? 0;
  const programSupportTotal =
    preAuctionEntries.find((e) => e.category === "Program Support")?._sum.amount ?? 0;

  // preAuctionTotal = sum of all entry categories (entries drive the value)
  const preAuctionTotal = preAuctionEntries.reduce(
    (sum, e) => sum + (e._sum.amount ?? 0),
    0
  );

  // Get all completed auction items
  const completedItems = await prisma.auctionItem.findMany({
    where: { isActive: false },
    select: { id: true, actualPrice: true },
  });

  // For each completed item, get the highest bid (if any)
  let auctionTotal = 0;
  let highestBid = 0;
  let itemsSold = 0;
  let itemsActualValueTotal = 0;
  for (const item of completedItems) {
    const highest = await prisma.bid.findFirst({
      where: { auctionItemId: item.id },
      orderBy: { amount: "desc" },
      select: { amount: true },
    });
    if (highest) {
      auctionTotal += highest.amount;
      if (highest.amount > highestBid) highestBid = highest.amount;
      itemsSold++;
      itemsActualValueTotal += item.actualPrice;
    }
  }

  // Items remaining (active auction items)
  const itemsRemaining = await prisma.auctionItem.count({ where: { isActive: true } });

  // Calculate totals
  const totalRaised = preAuctionTotal + auctionTotal;
  const percentOfGoal = targetAmount > 0 ? Math.min(100, Math.round((totalRaised / targetAmount) * 100)) : 0;
  const goalReached = totalRaised >= targetAmount;

  return NextResponse.json({
    galaYear: galaConfig.galaYear,
    targetAmount,
    preAuctionTotal,
    ticketSalesTotal,
    programSupportTotal,
    auctionTotal,
    totalRaised,
    percentOfGoal,
    goalReached,
    itemsSold,
    highestBid,
    itemsRemaining,
    itemsActualValueTotal,
  });
}
