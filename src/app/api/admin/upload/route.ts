import { NextResponse } from "next/server";
import { saveUpload } from "@/lib/uploads";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  const folder = String(form.get("folder") || "covers");
  if (!(file instanceof File)) return NextResponse.json({ error: "لا يوجد ملف" }, { status: 400 });
  const allowed = ["covers", "about", "avatars"];
  if (!allowed.includes(folder)) return NextResponse.json({ error: "مجلد غير مسموح" }, { status: 400 });
  try {
    const rel = await saveUpload(file, folder as "covers" | "about" | "avatars", "image");
    return NextResponse.json({ path: rel, url: `/api/public/image/${rel}` });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "فشل" }, { status: 400 });
  }
}
