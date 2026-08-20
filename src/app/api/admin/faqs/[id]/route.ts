import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const faq = await prisma.faq.update({
    where: { id: params.id },
    data: {
      ...(body.question !== undefined ? { question: String(body.question) } : {}),
      ...(body.answer !== undefined ? { answer: String(body.answer) } : {}),
    },
  });
  return NextResponse.json({ faq });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.faq.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
