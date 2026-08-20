import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const userId = String(body.userId || "");
  const courseId = String(body.courseId || "");
  if (!userId || !courseId) return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: { status: "ACTIVE" },
    create: { userId, courseId, status: "ACTIVE" },
  });
  return NextResponse.json({ enrollment });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "";
  const courseId = searchParams.get("courseId") || "";
  await prisma.enrollment.delete({ where: { userId_courseId: { userId, courseId } } });
  return NextResponse.json({ ok: true });
}
