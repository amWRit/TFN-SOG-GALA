import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { exportSeatsToSheet } from "@/lib/google-sheets";

export async function POST() {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const count = await exportSeatsToSheet();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error exporting seats:", error);
    return NextResponse.json({ error: "Failed to export seats." }, { status: 500 });
  }
}