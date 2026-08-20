import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: { grade: true, enrollments: { include: { course: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ students });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim() || null;
  const password = String(body.password || "Student@123");
  const gradeId = String(body.gradeId || "") || null;
  if (!name || !phone) return NextResponse.json({ error: "الاسم والهاتف مطلوبان" }, { status: 400 });
  const exists = await prisma.user.findFirst({ where: { OR: [{ phone }, ...(email ? [{ email }] : [])] } });
  if (exists) return NextResponse.json({ error: "الحساب موجود مسبقًا" }, { status: 400 });
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
  return NextResponse.json({ user });
}
