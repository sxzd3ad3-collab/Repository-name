import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { course: true, user: true },
  });
  if (!order) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}));
  const status = String(body.status || "");
  const adminNote = body.adminNote !== undefined ? String(body.adminNote) : undefined;
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ error: "غير موجود" }, { status: 404 });

  let userId = order.userId;
  if ((status === "ACTIVATED" || status === "PAYMENT_ACCEPTED") && !userId) {
    let user = await prisma.user.findFirst({ where: { phone: order.phone } });
    if (!user) {
      const { hashPassword } = await import("@/lib/auth");
      user = await prisma.user.create({
        data: {
          name: order.fullName,
          phone: order.phone,
          email: order.email,
          passwordHash: await hashPassword("Temp@123456"),
          role: "STUDENT",
        },
      });
    }
    userId = user.id;
  }

  if (status === "ACTIVATED" && userId) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId: order.courseId } },
      update: { status: "ACTIVE" },
      create: { userId, courseId: order.courseId, status: "ACTIVE" },
    });
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: {
      status: status || order.status,
      adminNote,
      userId,
    },
  });
  return NextResponse.json({ order: updated });
}
