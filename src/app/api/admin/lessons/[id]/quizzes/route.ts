import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const title = String(body.title || "اختبار");
  const questions = Array.isArray(body.questions) ? body.questions : [];
  const quiz = await prisma.quiz.create({
    data: {
      lessonId: params.id,
      title,
      questions: {
        create: questions.map((q: { question: string; options: string[]; correctIndex: number }, i: number) => ({
          question: String(q.question || ""),
          options: JSON.stringify(q.options || []),
          correctIndex: Number(q.correctIndex || 0),
          sortOrder: i,
        })),
      },
    },
    include: { questions: true },
  });
  return NextResponse.json({ quiz });
}
