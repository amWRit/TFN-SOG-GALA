import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// PATCH /api/admin/registration/[id] - update registration (assign seat, payment, etc)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  try {
    const updated = await prisma.registration.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ registration: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
  }
}
