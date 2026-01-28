import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { exportRegistrationsToSheet } from "@/lib/google-sheets";

export async function POST() {
  const isAuthenticated = await getSession();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const count = await exportRegistrationsToSheet();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error exporting registrations:", error);
    return NextResponse.json({ error: "Failed to export registrations." }, { status: 500 });
  }
}