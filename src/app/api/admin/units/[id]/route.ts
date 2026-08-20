import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const unit = await prisma.unit.update({
    where: { id: params.id },
    data: {
      ...(body.title ? { title: String(body.title) } : {}),
      ...(body.sortOrder !== undefined ? { sortOrder: Number(body.sortOrder) } : {}),
    },
  });
  return NextResponse.json({ unit });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.unit.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
