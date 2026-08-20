import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      grade: true,
      category: true,
      units: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: {
            orderBy: { sortOrder: "asc" },
            include: { videos: true, files: true, quizzes: { include: { questions: true } } },
          },
        },
      },
    },
  });
  if (!course) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json({ course });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = {};
  const fields = [
    "title",
    "slug",
    "shortDescription",
    "fullDescription",
    "targetAudience",
    "image",
    "duration",
    "level",
    "conversationLevel",
  ];
  for (const f of fields) if (body[f] !== undefined) data[f] = body[f] || (f === "conversationLevel" ? null : body[f]);
  if (body.price !== undefined) data.price = Number(body.price);
  if (body.gradeId !== undefined) data.gradeId = body.gradeId || null;
  if (body.categoryId !== undefined) data.categoryId = body.categoryId || null;
  if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
  if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
  if (body.learningOutcomes !== undefined) {
    data.learningOutcomes = JSON.stringify(
      Array.isArray(body.learningOutcomes)
        ? body.learningOutcomes
        : String(body.learningOutcomes)
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
    );
  }
  const course = await prisma.course.update({ where: { id: params.id }, data });
  return NextResponse.json({ course });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.course.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
