import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const stages = await prisma.stage.findMany({
    include: { grades: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ stages, categories });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.kind === "stage") {
    const name = String(body.name || "").trim();
    const stage = await prisma.stage.create({
      data: { name, slug: slugify(body.slug || name) || `stage-${Date.now()}`, sortOrder: Number(body.sortOrder || 99) },
    });
    return NextResponse.json({ stage });
  }
  if (body.kind === "grade") {
    const name = String(body.name || "").trim();
    const grade = await prisma.grade.create({
      data: {
        name,
        slug: slugify(body.slug || name) || `grade-${Date.now()}`,
        stageId: String(body.stageId),
        sortOrder: Number(body.sortOrder || 99),
      },
    });
    return NextResponse.json({ grade });
  }
  if (body.kind === "category") {
    const name = String(body.name || "").trim();
    const category = await prisma.category.create({
      data: {
        name,
        nameEn: body.nameEn || null,
        slug: slugify(body.slug || name) || `cat-${Date.now()}`,
        type: String(body.type || "SKILL"),
        description: body.description || null,
        sortOrder: Number(body.sortOrder || 99),
      },
    });
    return NextResponse.json({ category });
  }
  return NextResponse.json({ error: "نوع غير معروف" }, { status: 400 });
}
