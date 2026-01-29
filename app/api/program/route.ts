import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const program = await prisma.program.findMany({
    orderBy: { sequence: "asc" },
  });
  return NextResponse.json(program);
}
