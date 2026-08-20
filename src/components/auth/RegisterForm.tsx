"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm({ grades }: { grades: { id: string; name: string }[] }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        password: form.get("password"),
        gradeId: form.get("gradeId"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setErr(data.error || "تعذر إنشاء الحساب");
      return;
    }
    router.push("/student");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card mt-6 space-y-3 p-5">
      <div>
        <label className="label">الاسم بالكامل</label>
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
        <label className="label">الصف / المستوى</label>
        <select name="gradeId" className="input">
          <option value="">بدون تحديد</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">كلمة المرور</label>
        <input name="password" type="password" minLength={6} className="input" required />
      </div>
      {err && <p className="text-sm font-bold text-coral">{err}</p>}
      <button className="btn-primary w-full" disabled={loading}>
        {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
      </button>
    </form>
  );
}
