import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncGoogleSheets } from "@/lib/google-sheets";

/**
 * POST /api/admin/sheets/sync
 * Sync seating data from Google Sheets
 */
export async function POST() {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await syncGoogleSheets();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error syncing Google Sheets:", error);
    return NextResponse.json(
      { error: "Failed to sync Google Sheets. Check configuration." },
      { status: 500 }
    );
  }
}
