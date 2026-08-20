import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadAbs } from "@/lib/uploads";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order?.receiptPath) return NextResponse.json({ error: "لا يوجد إيصال" }, { status: 404 });
  const full = uploadAbs(order.receiptPath);
  if (!existsSync(full)) return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });
  const buf = await readFile(full);
  const ext = order.receiptPath.split(".").pop();
  const type = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return new NextResponse(buf, { headers: { "Content-Type": type } });
}
