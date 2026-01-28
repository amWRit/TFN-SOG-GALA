import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Returns all seats with their table and seat numbers, and if they are reserved (name present)
export async function GET() {
  try {
    const seats = await prisma.seat.findMany({
      select: {
        tableNumber: true,
        seatNumber: true,
      },
      orderBy: [
        { tableNumber: 'asc' },
        { seatNumber: 'asc' },
      ],
    });
    return NextResponse.json({ seats });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 });
  }
}
