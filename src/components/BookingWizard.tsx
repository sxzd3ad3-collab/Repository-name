"use client";

import { useState } from "react";
import Link from "next/link";
import type { SessionUser } from "@/lib/auth";

export function BookingWizard({
  course,
  user,
  settings,
  grades,
}: {
  course: { id: string; slug: string; title: string; price: number; gradeName: string };
  user: SessionUser | null;
  settings: Record<string, string>;
  grades: string[];
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    gradeOrLevel: course.gradeName || "",
  });
  const [proof, setProof] = useState({
    transferName: "",
    transferPhone: "",
    transferAmount: String(course.price),
    receipt: null as File | null,
  });
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const instapayReady = Boolean(settings.instapayName || settings.instapayAddress);

  async function submit() {
    setErr("");
    if (!proof.receipt) {
      setErr("يرجى رفع صورة إيصال التحويل.");
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.set("courseId", course.id);
    data.set("fullName", form.fullName);
    data.set("phone", form.phone);
    data.set("email", form.email);
    data.set("gradeOrLevel", form.gradeOrLevel);
    data.set("amount", String(course.price));
    data.set("transferName", proof.transferName);
    data.set("transferPhone", proof.transferPhone);
    data.set("transferAmount", proof.transferAmount);
    data.set("receipt", proof.receipt);
    const res = await fetch("/api/orders", { method: "POST", body: data });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) setErr(json.error || "تعذر إرسال الطلب");
    else setDone(true);
  }

  if (done) {
    return (
      <div className="card mt-6 p-6 text-center">
        <p className="text-lg font-black text-leaf">تم إرسال طلبك بنجاح.</p>
        <p className="mt-3 leading-8 text-navy/70">
          سيتم مراجعة عملية الدفع وتفعيل الكورس بعد التأكد من التحويل.
        </p>
        <Link href={user ? "/student/orders" : "/login"} className="btn-primary mt-5">
          متابعة حالة الطلب
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex gap-2 text-sm font-bold">
        {["البيانات", "الدفع", "إثبات التحويل"].map((t, i) => (
          <span
            key={t}
            className={`flex-1 rounded-full py-2 text-center ${
              step === i + 1 ? "bg-teal text-white" : "bg-white text-navy/60"
            }`}
          >
            {t}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="card space-y-3 p-5">
          <div>
            <label className="label">الاسم بالكامل</label>
            <input
              className="input"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">رقم الهاتف</label>
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">البريد الإلكتروني — اختياري</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">الصف أو المستوى</label>
            <input
              className="input"
              list="grades"
              value={form.gradeOrLevel}
              onChange={(e) => setForm({ ...form, gradeOrLevel: e.target.value })}
            />
            <datalist id="grades">
              {grades.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="label">اسم الكورس</label>
            <input className="input bg-sand" value={course.title} readOnly />
          </div>
          <div>
            <label className="label">المبلغ</label>
            <input className="input bg-sand" value={`${course.price} جنيه`} readOnly />
          </div>
          <div>
            <label className="label">وسيلة الدفع</label>
            <input className="input bg-sand" value="InstaPay" readOnly />
          </div>
          <button
            className="btn-primary w-full"
            onClick={() => {
              if (!form.fullName || !form.phone) {
                setErr("الاسم والهاتف مطلوبان.");
                return;
              }
              setErr("");
              setStep(2);
            }}
          >
            الانتقال لتعليمات الدفع
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card space-y-3 p-5">
          <h2 className="text-xl font-black">الدفع عن طريق InstaPay</h2>
          {instapayReady ? (
            <>
              <p>
                <span className="font-bold">اسم الحساب:</span> {settings.instapayName || "—"}
              </p>
              <p className="break-all">
                <span className="font-bold">رابط / عنوان InstaPay:</span> {settings.instapayAddress || "—"}
              </p>
              {settings.instapayAddress?.startsWith("http") && (
                <a
                  href={settings.instapayAddress}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold w-full"
                >
                  ادفع الآن عبر InstaPay
                </a>
              )}
            </>
          ) : (
            <p className="rounded-2xl bg-amber/20 p-3 text-sm font-bold text-navy">
              بيانات InstaPay تُحدد من لوحة التحكم. تواصل عبر واتساب 01552647559 لتأكيد التحويل إذا لم تظهر البيانات بعد.
            </p>
          )}
          <p className="text-sm leading-7 text-navy/70">
            حوّل مبلغ <b>{course.price} جنيه</b> ثم اضغط التالي لرفع صورة الإيصال.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-outline" onClick={() => setStep(1)}>
              رجوع
            </button>
            <button className="btn-primary" onClick={() => setStep(3)}>
              تم التحويل
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card space-y-3 p-5">
          <div>
            <label className="label">اسم صاحب التحويل</label>
            <input
              className="input"
              value={proof.transferName}
              onChange={(e) => setProof({ ...proof, transferName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">رقم الهاتف</label>
            <input
              className="input"
              value={proof.transferPhone}
              onChange={(e) => setProof({ ...proof, transferPhone: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">المبلغ</label>
            <input
              className="input"
              value={proof.transferAmount}
              onChange={(e) => setProof({ ...proof, transferAmount: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label">صورة إيصال التحويل</label>
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => setProof({ ...proof, receipt: e.target.files?.[0] || null })}
              required
            />
          </div>
          {err && <p className="text-sm font-bold text-coral">{err}</p>}
          <div className="grid grid-cols-2 gap-2">
            <button className="btn-outline" onClick={() => setStep(2)}>
              رجوع
            </button>
            <button className="btn-primary" disabled={loading} onClick={submit}>
              {loading ? "جاري الإرسال..." : "إرسال طلب الحجز"}
            </button>
          </div>
        </div>
      )}
      {err && step !== 3 && <p className="mt-3 text-sm font-bold text-coral">{err}</p>}
    </div>
  );
}
