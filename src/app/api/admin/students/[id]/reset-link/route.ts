import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const token = randomBytes(24).toString("hex");
  await prisma.passwordReset.create({
    data: {
      userId: params.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });
  return NextResponse.json({ token, path: `/reset-password?token=${token}` });
}
