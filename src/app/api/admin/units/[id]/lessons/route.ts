import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "اسم الدرس مطلوب" }, { status: 400 });
  const last = await prisma.lesson.findFirst({
    where: { unitId: params.id },
    orderBy: { sortOrder: "desc" },
  });
  const lesson = await prisma.lesson.create({
    data: {
      unitId: params.id,
      title,
      content: String(body.content || ""),
      isFree: Boolean(body.isFree),
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
  return NextResponse.json({ lesson });
}
