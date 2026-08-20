import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession, toSession, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const login = String(body.login || "").trim();
  const password = String(body.password || "");
  if (!login || !password) {
    return NextResponse.json({ error: "أدخل بيانات الدخول" }, { status: 400 });
  }
  const user = await prisma.user.findFirst({
    where: { OR: [{ phone: login }, { email: login }] },
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }
  if (!user.isActive) {
    return NextResponse.json({ error: "الحساب غير مفعّل" }, { status: 403 });
  }
  const session = toSession(user);
  await setSession(session);
  return NextResponse.json({ ok: true, role: session.role });
}
