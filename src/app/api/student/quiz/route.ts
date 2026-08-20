import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canAccessLesson } from "@/lib/access";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const quizId = String(body.quizId || "");
  const answers = Array.isArray(body.answers) ? body.answers.map(Number) : [];
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { sortOrder: "asc" } } },
  });
  if (!quiz) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  const access = await canAccessLesson(session.id, quiz.lessonId);
  if (!access.ok) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correctIndex) score += 1;
  });
  const attempt = await prisma.quizAttempt.create({
    data: { quizId, userId: session.id, score, total: quiz.questions.length },
  });
  return NextResponse.json({ score, total: quiz.questions.length, id: attempt.id });
}
