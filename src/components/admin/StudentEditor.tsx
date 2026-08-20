"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { orderStatusLabel } from "@/lib/utils";

export function StudentEditor({
  user,
  grades,
  courses,
}: {
  user: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    isActive: boolean;
    gradeId: string | null;
    enrollments: { id: string; courseId: string; title: string }[];
    orders: { id: string; title: string; status: string }[];
  };
  grades: { id: string; name: string }[];
  courses: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [msg, setMsg] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch(`/api/admin/students/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        gradeId: form.get("gradeId"),
        isActive: form.get("isActive") === "on",
        password: form.get("password"),
      }),
    });
    setMsg("تم الحفظ");
    router.refresh();
  }

  async function enroll(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const courseId = new FormData(e.currentTarget).get("courseId");
    await fetch("/api/admin/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, courseId }),
    });
    router.refresh();
  }

  async function resetLink() {
    const res = await fetch(`/api/admin/students/${user.id}/reset-link`, { method: "POST" });
    const data = await res.json();
    setMsg(`رابط إعادة التعيين: ${window.location.origin}${data.path}`);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form onSubmit={save} className="card space-y-3 p-5">
        <h1 className="text-xl font-black">بيانات الطالب</h1>
        <input name="name" className="input" defaultValue={user.name} />
        <input name="phone" className="input" defaultValue={user.phone} />
        <input name="email" className="input" defaultValue={user.email || ""} />
        <select name="gradeId" className="input" defaultValue={user.gradeId || ""}>
          <option value="">بدون صف</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <input name="password" className="input" placeholder="كلمة مرور جديدة (اختياري)" />
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" name="isActive" defaultChecked={user.isActive} /> الحساب نشط
        </label>
        <button className="btn-primary">حفظ التعديل</button>
        <button type="button" className="btn-outline w-full" onClick={resetLink}>
          إنشاء رابط إعادة تعيين كلمة المرور
        </button>
        {msg && <p className="text-sm font-bold text-leaf break-all">{msg}</p>}
      </form>
      <div className="space-y-4">
        <div className="card p-5">
          <h2 className="font-black">كورساته</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {user.enrollments.map((e) => (
              <li key={e.id} className="flex justify-between">
                {e.title}
                <button
                  className="text-coral"
                  onClick={async () => {
                    await fetch(`/api/admin/enrollments?userId=${user.id}&courseId=${e.courseId}`, { method: "DELETE" });
                    router.refresh();
                  }}
                >
                  إلغاء
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={enroll} className="mt-3 flex gap-2">
            <select name="courseId" className="input">
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <button className="btn-gold shrink-0">تفعيل</button>
          </form>
        </div>
        <div className="card p-5">
          <h2 className="font-black">طلباته</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {user.orders.map((o) => (
              <li key={o.id}>
                {o.title} — {orderStatusLabel(o.status)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
