import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET: List all admin accounts
export async function GET() {
  const admins = await prisma.admin.findMany({
    select: { id: true, email: true, createdAt: true }
  });
  return NextResponse.json({ admins });
}

// POST: Add a new admin account
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Admin with this email already exists" }, { status: 409 });
    }
    const hash = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({ data: { email, password: hash } });
    return NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email, createdAt: admin.createdAt } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add admin" }, { status: 500 });
  }
}
