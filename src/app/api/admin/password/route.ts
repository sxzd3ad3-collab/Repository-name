import { NextResponse } from "next/server";
import { getSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const password = String(body.password || "");
  if (password.length < 6) {
    return NextResponse.json({ error: "كلمة المرور يجب ألا تقل عن 6 أحرف" }, { status: 400 });
  }
  await prisma.user.update({
    where: { id: session.id },
    data: { passwordHash: await hashPassword(password) },
  });
  return NextResponse.json({ ok: true });
}
