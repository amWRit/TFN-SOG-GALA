import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/auction/items/[id]
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  let id: string | undefined;
  if (typeof context.params === "object" && "then" in context.params) {
    const params = await context.params;
    id = params.id;
  } else if (typeof context.params === "object" && "id" in context.params) {
    id = (context.params as { id: string }).id;
  }
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    const item = await prisma.auctionItem.findUnique({
      where: { id },
    });
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
