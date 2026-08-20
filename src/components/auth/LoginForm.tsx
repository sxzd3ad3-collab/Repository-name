"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: form.get("login"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setErr(data.error || "بيانات غير صحيحة");
      return;
    }
    const dest = next || (data.role === "ADMIN" ? "/admin" : "/student");
    router.push(dest);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-5">
      <div>
        <label className="label">الهاتف أو البريد</label>
        <input name="login" className="input" required />
      </div>
      <div>
        <label className="label">كلمة المرور</label>
        <input name="password" type="password" className="input" required />
      </div>
      {err && <p className="text-sm font-bold text-coral">{err}</p>}
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "جاري الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
