import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/seating
 * Fetch all seating assignments
 */
export async function GET() {
  try {
    const seats = await prisma.seat.findMany({
      orderBy: [
        { tableNumber: "asc" },
        { seatNumber: "asc" },
      ],
      include: {
        registration: {
          select: {
            id: true,
            name: true,
            quote: true,
            bio: true,
            involvement: true,
            imageUrl: true,
          },
        },
      },
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
