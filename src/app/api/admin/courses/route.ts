import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const courses = await prisma.course.findMany({
    include: { grade: true, category: true, _count: { select: { units: true, orders: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ courses });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "اسم الكورس مطلوب" }, { status: 400 });
  let slug = String(body.slug || slugify(title) || `course-${Date.now()}`);
  const exists = await prisma.course.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now()}`;
  const course = await prisma.course.create({
    data: {
      title,
      slug,
      shortDescription: String(body.shortDescription || ""),
      fullDescription: String(body.fullDescription || ""),
      targetAudience: String(body.targetAudience || ""),
      learningOutcomes: JSON.stringify(
        Array.isArray(body.learningOutcomes)
          ? body.learningOutcomes
          : String(body.learningOutcomes || "")
              .split("\n")
              .map((s: string) => s.trim())
              .filter(Boolean)
      ),
      image: body.image || "/covers/primary-4.svg",
      price: Number(body.price || 400),
      duration: String(body.duration || ""),
      level: String(body.level || "مبتدئ"),
      gradeId: body.gradeId || null,
      categoryId: body.categoryId || null,
      conversationLevel: body.conversationLevel || null,
      isPublished: body.isPublished !== false,
      isFeatured: Boolean(body.isFeatured),
    },
  });
  return NextResponse.json({ course });
}
