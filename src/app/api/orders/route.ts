import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { saveUpload } from "@/lib/uploads";

export async function POST(req: Request) {
  const session = await getSession();
  const form = await req.formData();
  const courseId = String(form.get("courseId") || "");
  const fullName = String(form.get("fullName") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const email = String(form.get("email") || "").trim() || null;
  const gradeOrLevel = String(form.get("gradeOrLevel") || "").trim() || null;
  const amount = Number(form.get("amount") || 0);
  const transferName = String(form.get("transferName") || "").trim();
  const transferPhone = String(form.get("transferPhone") || "").trim();
  const transferAmount = Number(form.get("transferAmount") || 0);
  const receipt = form.get("receipt");

  if (!courseId || !fullName || !phone) {
    return NextResponse.json({ error: "أكمل البيانات المطلوبة" }, { status: 400 });
  }
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: "الكورس غير موجود" }, { status: 404 });
  if (!(receipt instanceof File) || receipt.size === 0) {
    return NextResponse.json({ error: "ارفع صورة الإيصال" }, { status: 400 });
  }

  let receiptPath = "";
  try {
    receiptPath = await saveUpload(receipt, "receipts", "image");
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "تعذر رفع الإيصال" },
      { status: 400 }
    );
  }

  let userId = session?.id || null;
  if (!userId) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ phone }, ...(email ? [{ email }] : [])] },
    });
    userId = existing?.id || null;
  }

  const order = await prisma.order.create({
    data: {
      userId,
      courseId,
      fullName,
      phone,
      email,
      gradeOrLevel,
      amount: amount || course.price,
      paymentMethod: "INSTAPAY",
      transferName,
      transferPhone,
      transferAmount: transferAmount || course.price,
      receiptPath,
      status: "PENDING",
    },
  });
  return NextResponse.json({ ok: true, id: order.id });
}
