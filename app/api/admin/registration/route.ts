
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// GET /api/admin/registration - returns all registrations or just the count
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countOnly = searchParams.get('countOnly');
  const sumPayment = searchParams.get('sumPayment');

  if (countOnly) {
    const count = await prisma.registration.count();
    return NextResponse.json({ count });
  }

  if (sumPayment) {
    // Sum the payment field from all registrations
    const result = await prisma.registration.aggregate({
      _sum: { payment: true }
    });
    return NextResponse.json({ sum: result._sum.payment || 0 });
  }

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
