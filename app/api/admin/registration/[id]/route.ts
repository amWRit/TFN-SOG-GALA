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

// DELETE /api/admin/registration/[id] - delete registration by ID
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: 'Registration ID is required' }, { status: 400 });
  }
  try {
    const deleted = await prisma.registration.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
  }
}
