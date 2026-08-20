"use client";

import { useState } from "react";

export function ContactForm() {
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/public/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        message: form.get("message"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) setErr(data.error || "حدث خطأ");
    else {
      setMsg("تم إرسال رسالتك بنجاح. سنرد عليك في أقرب وقت.");
      e.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-3 p-5">
      <div>
        <label className="label">الاسم</label>
        <input name="name" className="input" required />
      </div>
      <div>
        <label className="label">رقم الهاتف</label>
        <input name="phone" className="input" required />
      </div>
      <div>
        <label className="label">البريد الإلكتروني (اختياري)</label>
        <input name="email" type="email" className="input" />
      </div>
      <div>
        <label className="label">الرسالة</label>
        <textarea name="message" className="input min-h-32" required />
      </div>
      {err && <p className="text-sm font-bold text-coral">{err}</p>}
      {msg && <p className="text-sm font-bold text-leaf">{msg}</p>}
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "جاري الإرسال..." : "إرسال"}
      </button>
    </form>
  );
}
