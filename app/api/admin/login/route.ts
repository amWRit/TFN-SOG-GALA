import { NextResponse } from "next/server";
import { verifyPassword, createSession } from "@/lib/auth";



/**
 * POST /api/admin/login
 * Admin login endpoint
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;


    const isValid = await verifyPassword(email, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
