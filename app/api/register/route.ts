
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, table, seat, testimonial } = body;
  try {
    await prisma.registration.create({
      data: {
        name,
        email,
        phone: phone || null,
        tablePreference: table ? Number(table) : null,
        seatPreference: seat ? Number(seat) : null,
        quote: testimonial || null,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed.' }, { status: 500 });
  }
}
