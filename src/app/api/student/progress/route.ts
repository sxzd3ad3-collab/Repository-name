import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canAccessLesson } from "@/lib/access";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const lessonId = String(body.lessonId || "");
  const completed = Boolean(body.completed);
  const access = await canAccessLesson(session.id, lessonId);
  if (!access.ok) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  await prisma.progress.upsert({
    where: { userId_lessonId: { userId: session.id, lessonId } },
    update: { completed, lastWatchedAt: new Date() },
    create: { userId: session.id, lessonId, completed },
  });
  await prisma.user.update({ where: { id: session.id }, data: { lastLessonId: lessonId } });
  return NextResponse.json({ ok: true });
}
