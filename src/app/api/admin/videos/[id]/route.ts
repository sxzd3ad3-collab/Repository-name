import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.video.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
