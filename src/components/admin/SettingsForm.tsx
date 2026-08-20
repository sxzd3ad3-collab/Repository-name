"use client";

import { useState } from "react";

const fields: [string, string, string?][] = [
  ["siteName", "اسم الموقع"],
  ["siteNameEn", "الاسم بالإنجليزية"],
  ["siteTagline", "الوصف العام", "textarea"],
  ["instapayName", "اسم حساب InstaPay"],
  ["instapayAddress", "رقم / عنوان InstaPay"],
  ["whatsapp", "واتساب"],
  ["contactPhone", "هاتف التواصل"],
  ["contactEmail", "البريد"],
  ["facebookUrl", "رابط Facebook"],
  ["instagramUrl", "رابط Instagram"],
  ["instagramHandle", "معرف Instagram"],
  ["youtubeUrl", "رابط YouTube"],
  ["tiktokUrl", "رابط TikTok"],
  ["aboutName", "الاسم في صفحة من نحن"],
  ["aboutBio", "نبذة عني", "textarea"],
  ["aboutExperience", "خبرتي", "textarea"],
  ["aboutMethod", "طريقة التدريس", "textarea"],
  ["aboutVision", "رؤيتي التعليمية", "textarea"],
];

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/settings", { method: "PUT", body: form });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) setErr(data.error || "تعذر الحفظ. سجّل الدخول مرة أخرى ثم أعد المحاولة.");
    else setMsg("تم حفظ الإعدادات");
  }
  return (
    <form onSubmit={onSubmit} className="card mt-5 space-y-3 p-5">
      {fields.map(([key, label, type]) => (
        <div key={key}>
          <label className="label">{label}</label>
          {type === "textarea" ? (
            <textarea name={key} className="input min-h-24" defaultValue={settings[key] || ""} />
          ) : (
            <input name={key} className="input" defaultValue={settings[key] || ""} />
          )}
        </div>
      ))}
      <div>
        <label className="label">صورة صفحة من نحن</label>
        <input type="file" name="aboutImageFile" accept="image/*" className="input" />
      </div>
      <div>
        <label className="label">اللوجو</label>
        <input type="file" name="logoFile" accept="image/*" className="input" />
      </div>
      {err && <p className="font-bold text-coral">{err}</p>}
      {msg && <p className="font-bold text-leaf">{msg}</p>}
      <button className="btn-primary" disabled={loading}>
        {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
      </button>
    </form>
  );
}

export function AdminPasswordForm() {
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");
    setErr("");
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const res = await fetch("/api/admin/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "تعذر التغيير");
    else {
      setMsg("تم تغيير كلمة المرور. استخدم الكلمة الجديدة في الدخول التالي.");
      e.currentTarget.reset();
    }
  }
  return (
    <form onSubmit={onSubmit} className="card mt-5 space-y-3 p-5">
      <h2 className="font-black">تغيير كلمة مرور الإدارة</h2>
      <input name="password" type="password" minLength={6} className="input" placeholder="كلمة مرور جديدة" required />
      {err && <p className="text-sm font-bold text-coral">{err}</p>}
      {msg && <p className="text-sm font-bold text-leaf">{msg}</p>}
      <button className="btn-gold">تغيير كلمة المرور</button>
    </form>
  );
}
