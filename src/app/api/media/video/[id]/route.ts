import { createReadStream, existsSync } from "fs";
import { stat } from "fs/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { canAccessLesson } from "@/lib/access";
import { uploadAbs } from "@/lib/uploads";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const video = await prisma.video.findUnique({ where: { id: params.id } });
  if (!video?.filePath) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  if (session.role !== "ADMIN") {
    const access = await canAccessLesson(session.id, video.lessonId);
    if (!access.ok) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const full = uploadAbs(video.filePath);
  if (!existsSync(full)) return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });
  const info = await stat(full);
  const stream = createReadStream(full);
  const range = req.headers.get("range");
  const ext = video.filePath.split(".").pop();
  const type = ext === "webm" ? "video/webm" : "video/mp4";
  if (range) {
    const [s, e] = range.replace(/bytes=/, "").split("-");
    const start = Number(s);
    const end = e ? Number(e) : info.size - 1;
    return new NextResponse(stream as unknown as ReadableStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${info.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": String(end - start + 1),
        "Content-Type": type,
      },
    });
  }
  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": type,
      "Content-Length": String(info.size),
      "Accept-Ranges": "bytes",
    },
  });
}
