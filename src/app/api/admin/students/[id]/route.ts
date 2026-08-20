import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      grade: true,
      enrollments: { include: { course: true } },
      orders: { include: { course: true }, orderBy: { createdAt: "desc" } },
      resetTokens: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!user) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  const { passwordHash, ...safe } = user;
  return NextResponse.json({ user: safe });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  if (body.name) data.name = String(body.name);
  if (body.phone) data.phone = String(body.phone);
  if (body.email !== undefined) data.email = String(body.email || "") || null;
  if (body.gradeId !== undefined) data.gradeId = String(body.gradeId || "") || null;
  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
  if (body.password) data.passwordHash = await hashPassword(String(body.password));
  const user = await prisma.user.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, id: user.id });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.user.update({ where: { id: params.id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
