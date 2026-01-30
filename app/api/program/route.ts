import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Debug: log incoming data
    console.log('POST /api/program payload:', data);
    // Validation for required fields
    if (!data.title || !data.startTime || !data.endTime) {
      return NextResponse.json({ error: 'Missing required fields: title, startTime, endTime' }, { status: 400 });
    } else {
      // Remove id if present, let Prisma auto-generate
      if (data.id) delete data.id;
      // Set sequence to max+1 if not provided
      if (!data.sequence) {
        const max = await prisma.program.aggregate({ _max: { sequence: true } });
        data.sequence = (max._max.sequence || 0) + 1;
      }
      // Convert startTime/endTime to Date if they are strings
      if (typeof data.startTime === 'string') data.startTime = new Date(data.startTime);
      if (typeof data.endTime === 'string') data.endTime = new Date(data.endTime);
      const created = await prisma.program.create({ data });
      return NextResponse.json(created);
    }
  } catch (e) {
    // Debug: log error
    console.error('POST /api/program error:', e);
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

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
    const errorMessage = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
