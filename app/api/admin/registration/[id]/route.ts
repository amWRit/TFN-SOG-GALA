import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

// PATCH /api/admin/registration/[id] - update registration (assign seat, payment, etc)
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const body = await req.json();
  const { id } = await context.params;
  try {
    const updated = await prisma.registration.update({
      where: { id },
      data: body,
    });
    return NextResponse.json({ registration: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
  }
}
