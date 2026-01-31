import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Helper to extract Google Drive file ID from a shareable link
function extractDriveFileId(link: string): string | null {
  const match = link.match(/\/d\/([\w-]+)/) || link.match(/id=([\w-]+)/);
  return match ? match[1] : null;
}

export async function GET() {
  try {
    const images = await prisma.gDriveImageResource.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { label, driveLink, alt, type } = await req.json();
    if (!label || !driveLink) {
      return NextResponse.json({ error: 'Label and Google Drive link are required.' }, { status: 400 });
    }
    const fileId = extractDriveFileId(driveLink);
    if (!fileId) {
      return NextResponse.json({ error: 'Invalid Google Drive link.' }, { status: 400 });
    }
    const image = await prisma.gDriveImageResource.create({
      data: { label, fileId, alt, type },
    });
    return NextResponse.json({ image });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 });
  }
}
