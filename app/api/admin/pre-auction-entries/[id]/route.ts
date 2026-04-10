import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const entry = await prisma.preAuctionEntry.findUnique({ where: { id } });
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    await prisma.preAuctionEntry.delete({ where: { id } });

    // Recompute and sync preAuctionTotal on GalaConfig
    const config = await prisma.galaConfig.findFirst({ orderBy: { galaYear: "desc" } });
    if (config) {
      const aggregate = await prisma.preAuctionEntry.aggregate({
        where: { galaYear: entry.galaYear },
        _sum: { amount: true },
      });
      await prisma.galaConfig.update({
        where: { id: config.id },
        data: { preAuctionTotal: aggregate._sum.amount ?? 0 },
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
