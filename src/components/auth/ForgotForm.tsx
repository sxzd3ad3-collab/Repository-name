"use client";

import { useState } from "react";

export function ForgotForm() {
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setMsg("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: form.get("login") }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "حدث خطأ");
    else setMsg(data.message);
  }

  return (
    <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-5">
      <div>
        <label className="label">الهاتف أو البريد</label>
        <input name="login" className="input" required />
      </div>
      {err && <p className="text-sm font-bold text-coral">{err}</p>}
      {msg && <p className="text-sm font-bold text-leaf">{msg}</p>}
      <button className="btn-primary w-full">إرسال الطلب</button>
    </form>
  );
}
