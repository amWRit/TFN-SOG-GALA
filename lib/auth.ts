import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "gala@teachfornepal.org";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

/**
 * Simple session-based authentication
 * In production, consider using NextAuth.js or similar
 */
export async function verifyPassword(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD_HASH) {
    // Default password: "admin123" (change in production!)
    const defaultHash = await bcrypt.hash("admin123", 10);
    return bcrypt.compare(password, defaultHash);
  }
  return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export async function createSession() {
  const cookieStore = await cookies();
  cookieStore.set("admin-auth", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function getSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-auth");
  return session?.value === "authenticated";
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-auth");
}
