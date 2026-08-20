"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: form.get("password") }),
    });
    const data = await res.json();
    if (!res.ok) setErr(data.error || "الرابط غير صالح");
    else router.push("/login");
  }

  if (!token) return <p className="mt-4 text-coral">رابط غير مكتمل.</p>;

  return (
    <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-5">
      <div>
        <label className="label">كلمة المرور الجديدة</label>
        <input name="password" type="password" minLength={6} className="input" required />
      </div>
      {err && <p className="text-sm font-bold text-coral">{err}</p>}
      <button className="btn-primary w-full">حفظ</button>
    </form>
  );
}
