import { NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/settings";
import { saveUpload } from "@/lib/uploads";

export async function GET() {
  return NextResponse.json({ settings: await getSettings() });
}

export async function PUT(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const values: Record<string, string> = {};
      for (const [k, v] of form.entries()) {
        if (typeof v === "string") values[k] = v;
      }
      const about = form.get("aboutImageFile");
      if (about instanceof File && about.size > 0) {
        values.aboutImage = await saveUpload(about, "about", "image");
      }
      const logo = form.get("logoFile");
      if (logo instanceof File && logo.size > 0) {
        values.logoUrl = `/api/public/image/${await saveUpload(logo, "about", "image")}`;
      }
      await setSettings(values);
      return NextResponse.json({ settings: await getSettings() });
    }
    const body = await req.json().catch(() => ({}));
    await setSettings(body);
    return NextResponse.json({ settings: await getSettings() });
  } catch (e) {
    const message = e instanceof Error ? e.message : "تعذر حفظ الإعدادات";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
