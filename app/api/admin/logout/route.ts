import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

/**
 * POST /api/admin/logout
 * Admin logout endpoint
 */
export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true });
}
