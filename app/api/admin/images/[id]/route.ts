export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Image ID is required.' }, { status: 400 });
    }
    const body = await req.json();
    const { label, driveLink, alt, type } = body;
    if (!label || !driveLink) {
      return NextResponse.json({ error: 'Label and Google Drive link are required.' }, { status: 400 });
    }
    // Extract fileId from driveLink
    const match = driveLink.match(/\/d\/([\w-]+)/);
    const fileId = match ? match[1] : null;
    if (!fileId) {
      return NextResponse.json({ error: 'Invalid Google Drive link.' }, { status: 400 });
    }
    // Update the image resource
    const updated = await prisma.gDriveImageResource.update({
      where: { id },
      data: {
        label,
        fileId,
        alt,
        type,
      },
    });
    return NextResponse.json({ success: true, image: updated });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}
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
