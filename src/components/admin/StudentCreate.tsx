"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StudentCreate({ grades }: { grades: { id: string; name: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    setOpen(false);
    router.refresh();
  }
  return (
    <div className="mt-4">
      <button className="btn-primary" onClick={() => setOpen((v) => !v)}>
        إضافة طالب
      </button>
      {open && (
        <form onSubmit={onSubmit} className="card mt-3 grid gap-3 p-4 sm:grid-cols-2">
          <input name="name" className="input" placeholder="الاسم" required />
          <input name="phone" className="input" placeholder="الهاتف" required />
          <input name="email" className="input" placeholder="البريد" />
          <input name="password" className="input" placeholder="كلمة المرور" defaultValue="Student@123" />
          <select name="gradeId" className="input">
            <option value="">بدون صف</option>
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <button className="btn-gold">حفظ</button>
        </form>
      )}
    </div>
  );
}
