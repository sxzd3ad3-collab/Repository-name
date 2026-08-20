import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const lesson = await prisma.lesson.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined ? { title: String(body.title) } : {}),
      ...(body.content !== undefined ? { content: String(body.content) } : {}),
      ...(body.isFree !== undefined ? { isFree: Boolean(body.isFree) } : {}),
      ...(body.sortOrder !== undefined ? { sortOrder: Number(body.sortOrder) } : {}),
    },
  });
  return NextResponse.json({ lesson });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.lesson.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
