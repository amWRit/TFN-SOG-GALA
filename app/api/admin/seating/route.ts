import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/seating
 * Fetch all seating assignments (admin)
 */
export async function GET() {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const seats = await prisma.seat.findMany({
      orderBy: [
        { tableNumber: "asc" },
        { seatNumber: "asc" },
      ],
    });

    return NextResponse.json(seats);
  } catch (error) {
    console.error("Error fetching seats:", error);
    return NextResponse.json(
      { error: "Failed to fetch seating data" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seating
 * Update a seat assignment
 */
export async function PUT(request: Request) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { seatId, registrationId } = body;

    const seat = await prisma.seat.update({
      where: { id: seatId },
      data: {
        registrationId: registrationId || null,
      },
    });

    return NextResponse.json(seat);
  } catch (error) {
    console.error("Error updating seat:", error);
    return NextResponse.json(
      { error: "Failed to update seat" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seating
 * Add a table and seats (admin)
 */
export async function POST(request: Request) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { tableNumber, seatCount } = await request.json();
    if (!tableNumber || !seatCount) {
      return NextResponse.json({ error: 'Missing tableNumber or seatCount' }, { status: 400 });
    }
    // Create seats for the table
    const seats = Array.from({ length: seatCount }, (_, i) => ({
      tableNumber: Number(tableNumber),
      seatNumber: i + 1,
      name: null,
      quote: null,
      bio: null,
      involvement: null,
      imageUrl: null,
    }));
    await prisma.seat.createMany({ data: seats, skipDuplicates: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding seats:", error);
    return NextResponse.json({ error: 'Failed to add seats' }, { status: 500 });
  }
}
