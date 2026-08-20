import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "اسم الوحدة مطلوب" }, { status: 400 });
  const last = await prisma.unit.findFirst({
    where: { courseId: params.id },
    orderBy: { sortOrder: "desc" },
  });
  const unit = await prisma.unit.create({
    data: { courseId: params.id, title, sortOrder: (last?.sortOrder ?? -1) + 1 },
  });
  return NextResponse.json({ unit });
}
