import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const login = String(body.login || "").trim();
  if (!login) return NextResponse.json({ error: "أدخل الهاتف أو البريد" }, { status: 400 });
  const user = await prisma.user.findFirst({
    where: { OR: [{ phone: login }, { email: login }] },
  });
  if (user) {
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: randomBytes(24).toString("hex"),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
  }
  return NextResponse.json({
    message:
      "إذا كان الحساب موجودًا فقد تم إنشاء طلب إعادة التعيين. تواصل عبر واتساب 01552647559 أو انتظر الإدارة لإرسال رابط التعيين.",
  });
}
