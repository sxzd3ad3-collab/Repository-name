import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [students, courses, pending, activated, messages] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.course.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "ACTIVATED" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);
  return NextResponse.json({ students, courses, pending, activated, messages });
}
