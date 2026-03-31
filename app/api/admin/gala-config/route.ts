import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { galaYear, targetAmount, preAuctionTotal } = await req.json();
    // Only one config row, update the latest (or create if missing)
    const existing = await prisma.galaConfig.findFirst({ orderBy: { galaYear: "desc" } });
    let config;
    if (existing) {
      config = await prisma.galaConfig.update({
        where: { id: existing.id },
        data: { galaYear, targetAmount, preAuctionTotal },
      });
    } else {
      config = await prisma.galaConfig.create({
        data: { galaYear, targetAmount, preAuctionTotal },
      });
    }
    return NextResponse.json({ success: true, config });
  } catch (e) {
    return NextResponse.json({ success: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}
