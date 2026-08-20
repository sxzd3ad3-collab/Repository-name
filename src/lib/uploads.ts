import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

export const UPLOAD_ROOT = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(process.cwd(), "data", "uploads");

const ALLOWED_IMAGE = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_DOC = new Set<string>(["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_VIDEO = new Set(["video/mp4", "video/webm", "video/ogg"]);

export async function saveUpload(
  file: File,
  folder: "covers" | "receipts" | "videos" | "files" | "avatars" | "about",
  kind: "image" | "doc" | "video" = "image"
) {
  const type = file.type;
  if (kind === "image" && !ALLOWED_IMAGE.has(type)) {
    throw new Error("نوع الصورة غير مدعوم. استخدم JPG أو PNG أو WEBP.");
  }
  if (kind === "doc" && !ALLOWED_DOC.has(type)) {
    throw new Error("نوع الملف غير مدعوم. استخدم PDF أو صورة.");
  }
  if (kind === "video" && !ALLOWED_VIDEO.has(type)) {
    throw new Error("نوع الفيديو غير مدعوم. استخدم MP4 أو WEBM.");
  }

  const ext =
    type === "image/jpeg"
      ? "jpg"
      : type === "image/png"
      ? "png"
      : type === "image/webp"
      ? "webp"
      : type === "image/gif"
      ? "gif"
      : type === "application/pdf"
      ? "pdf"
      : type === "video/webm"
      ? "webm"
      : type === "video/ogg"
      ? "ogg"
      : "mp4";

  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });
  const full = path.join(dir, name);
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > 40 * 1024 * 1024) {
    throw new Error("حجم الملف كبير جدًا.");
  }
  await writeFile(full, buf);
  return `${folder}/${name}`;
}

export function uploadAbs(rel: string) {
  return path.join(UPLOAD_ROOT, rel);
}
