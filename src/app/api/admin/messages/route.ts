import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ messages });
}

export async function PUT(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.id) {
    await prisma.contactMessage.update({ where: { id: String(body.id) }, data: { isRead: true } });
  }
  return NextResponse.json({ ok: true });
}
