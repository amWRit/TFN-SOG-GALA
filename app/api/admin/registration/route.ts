import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/admin/registration - returns all registrations
export async function GET() {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: [
        { tablePreference: 'asc' },
        { seatPreference: 'asc' },
        { createdAt: 'asc' }
      ]
    });
    return NextResponse.json({ registrations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}
