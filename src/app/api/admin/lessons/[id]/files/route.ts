import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const form = await req.formData();
  const title = String(form.get("title") || "ملف");
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "اختر ملفًا" }, { status: 400 });
  }
  try {
    const filePath = await saveUpload(file, "files", "doc");
    const row = await prisma.lessonFile.create({
      data: { lessonId: params.id, title, filePath, fileType: file.type.includes("pdf") ? "pdf" : "file" },
    });
    return NextResponse.json({ file: row });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "فشل الرفع" }, { status: 400 });
  }
}
