import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { UPLOAD_ROOT } from "@/lib/uploads";

const PUBLIC_FOLDERS = new Set(["covers", "about", "avatars"]);

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const parts = params.path || [];
  if (parts.length < 2 || parts.some((p) => p.includes("..") || p.includes("/"))) {
    return NextResponse.json({ error: "غير صالح" }, { status: 400 });
  }
  if (!PUBLIC_FOLDERS.has(parts[0])) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const full = path.join(UPLOAD_ROOT, ...parts);
  if (!existsSync(full)) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
  const buf = await readFile(full);
  const ext = parts[parts.length - 1].split(".").pop();
  const type =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "gif" ? "image/gif" : "image/jpeg";
  return new NextResponse(buf, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=86400" } });
}
