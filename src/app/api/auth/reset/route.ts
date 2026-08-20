import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const token = String(body.token || "");
  const password = String(body.password || "");
  if (!token || password.length < 6) {
    return NextResponse.json({ error: "الرابط أو كلمة المرور غير صالحة" }, { status: 400 });
  }
  const row = await prisma.passwordReset.findUnique({ where: { token } });
  if (!row || row.used || row.expiresAt < new Date()) {
    return NextResponse.json({ error: "الرابط منتهي أو مستخدم" }, { status: 400 });
  }
  await prisma.user.update({
    where: { id: row.userId },
    data: { passwordHash: await hashPassword(password) },
  });
  await prisma.passwordReset.update({ where: { id: row.id }, data: { used: true } });
  return NextResponse.json({ ok: true });
}
