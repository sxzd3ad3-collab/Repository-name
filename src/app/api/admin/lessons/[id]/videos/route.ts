import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/uploads";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const title = String(form.get("title") || "فيديو");
    const youtubeUrl = String(form.get("youtubeUrl") || "") || null;
    const duration = String(form.get("duration") || "") || null;
    const file = form.get("file");
    let filePath: string | null = null;
    if (file instanceof File && file.size > 0) {
      try {
        filePath = await saveUpload(file, "videos", "video");
      } catch (e) {
        return NextResponse.json({ error: e instanceof Error ? e.message : "رفع فشل" }, { status: 400 });
      }
    }
    const video = await prisma.video.create({
      data: { lessonId: params.id, title, youtubeUrl, filePath, duration },
    });
    return NextResponse.json({ video });
  }
  const body = await req.json().catch(() => ({}));
  const video = await prisma.video.create({
    data: {
      lessonId: params.id,
      title: String(body.title || "فيديو"),
      youtubeUrl: body.youtubeUrl || null,
      duration: body.duration || null,
    },
  });
  return NextResponse.json({ video });
}
