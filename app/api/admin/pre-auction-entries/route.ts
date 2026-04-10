import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await prisma.galaConfig.findFirst({ orderBy: { galaYear: "desc" } });
  const galaYear = config?.galaYear ?? 2026;

  const entries = await prisma.preAuctionEntry.findMany({
    where: { galaYear },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { category, amount, note } = await req.json();

    if (!category || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid entry data" }, { status: 400 });
    }

    const config = await prisma.galaConfig.findFirst({ orderBy: { galaYear: "desc" } });
    if (!config) {
      return NextResponse.json({ error: "No gala config found" }, { status: 404 });
    }

    const entry = await prisma.preAuctionEntry.create({
      data: {
        galaYear: config.galaYear,
        category,
        amount: Number(amount),
        note: note || null,
      },
    });

    // Recompute and sync preAuctionTotal on GalaConfig
    const aggregate = await prisma.preAuctionEntry.aggregate({
      where: { galaYear: config.galaYear },
      _sum: { amount: true },
    });
    await prisma.galaConfig.update({
      where: { id: config.id },
      data: { preAuctionTotal: aggregate._sum.amount ?? 0 },
    });

    return NextResponse.json({ success: true, entry });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
