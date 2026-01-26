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
    const { seatId, name, quote, bio, involvement, imageUrl } = body;

    const seat = await prisma.seat.update({
      where: { id: seatId },
      data: {
        name: name || null,
        quote: quote || null,
        bio: bio || null,
        involvement: involvement || null,
        imageUrl: imageUrl || null,
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
