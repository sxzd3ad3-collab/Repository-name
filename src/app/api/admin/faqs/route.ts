import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ faqs });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const last = await prisma.faq.findFirst({ orderBy: { sortOrder: "desc" } });
  const faq = await prisma.faq.create({
    data: {
      question: String(body.question || ""),
      answer: String(body.answer || ""),
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
  return NextResponse.json({ faq });
}
