import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;  // ✅ Await first
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Image ID is required.' }, { status: 400 });
    }
    
    await prisma.gDriveImageResource.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
