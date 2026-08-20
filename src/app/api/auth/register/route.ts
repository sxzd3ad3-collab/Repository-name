import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSession, toSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim() || null;
  const password = String(body.password || "");
  const gradeId = String(body.gradeId || "") || null;
  if (!name || !phone || password.length < 6) {
    return NextResponse.json(
      { error: "الاسم والهاتف وكلمة مرور من 6 أحرف على الأقل مطلوبة" },
      { status: 400 }
    );
  }
  const exists = await prisma.user.findFirst({
    where: { OR: [{ phone }, ...(email ? [{ email }] : [])] },
  });
  if (exists) {
    return NextResponse.json({ error: "يوجد حساب بنفس الهاتف أو البريد" }, { status: 400 });
  }
  const user = await prisma.user.create({
    data: {
      name,
      phone,
      email,
      passwordHash: await hashPassword(password),
      role: "STUDENT",
      gradeId,
    },
  });
  await setSession(toSession(user));
  return NextResponse.json({ ok: true });
}
