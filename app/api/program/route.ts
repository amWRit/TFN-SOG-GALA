import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const program = await prisma.program.findMany({
    orderBy: { sequence: "asc" },
  });
  return NextResponse.json(program);
}

export async function PATCH(req: Request) {
  try {
    const { order } = await req.json(); // order: [{id, sequence}, ...]
    if (!Array.isArray(order)) {
      return NextResponse.json({ error: "Invalid order format" }, { status: 400 });
    }
    // Update all sequence numbers in a transaction
    await prisma.$transaction(
      order.map((item) =>
        prisma.program.update({ where: { id: item.id }, data: { sequence: item.sequence } })
      )
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
