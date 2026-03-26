import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { registrations, clearExisting } = await req.json();
    if (!Array.isArray(registrations) || registrations.length === 0) {
      return NextResponse.json({ error: 'No registrations provided.' }, { status: 400 });
    }
    // Optionally clear existing registrations
    if (clearExisting) {
      await prisma.registration.deleteMany({});
    }
    // Validate and insert registrations
    let count = 0;
    for (const reg of registrations) {
      if (!reg.name || !reg.email) continue;
      await prisma.registration.create({
        data: {
          name: reg.name.trim(),
          email: reg.email,
          phone: reg.phone || '',
          tablePreference: reg.table_preference ? Number(reg.table_preference) : null,
          seatPreference: reg.seat_preference ? Number(reg.seat_preference) : null,
          payment: reg.payment ? Number(reg.payment) : 0,
          paymentStatus: reg.payment_status === 'true' || reg.payment_status === true,
          quote: reg.quote || '',
          bio: reg.bio || '',
          involvement: reg.involvement || '',
        },
      });
      count++;
    }
    return NextResponse.json({ count });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Import failed.' }, { status: 500 });
  }
}
