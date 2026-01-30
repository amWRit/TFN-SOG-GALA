import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/admin/seating/[id]
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const params = await Promise.resolve(context.params);
    const seatId = params.id;
    await prisma.seat.delete({ where: { id: seatId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting seat:", error);
    return NextResponse.json({ error: "Failed to delete seat" }, { status: 500 });
  }
}
