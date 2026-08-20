import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim() || null;
  const message = String(body.message || "").trim();
  if (!name || !phone || !message) {
    return NextResponse.json({ error: "الاسم والهاتف والرسالة مطلوبة" }, { status: 400 });
  }
  await prisma.contactMessage.create({ data: { name, phone, email, message } });
  return NextResponse.json({ ok: true });
}
