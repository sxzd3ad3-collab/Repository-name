import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canAccessLesson } from "@/lib/access";
import { uploadAbs } from "@/lib/uploads";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const file = await prisma.lessonFile.findUnique({ where: { id: params.id } });
  if (!file) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  if (session.role !== "ADMIN") {
    const access = await canAccessLesson(session.id, file.lessonId);
    if (!access.ok) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const full = uploadAbs(file.filePath);
  if (!existsSync(full)) return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });
  const buf = await readFile(full);
  const ext = file.filePath.split(".").pop();
  const type = ext === "pdf" ? "application/pdf" : "application/octet-stream";
  return new NextResponse(buf, {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `inline; filename="${encodeURIComponent(file.title)}.${ext}"`,
    },
  });
}
