"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrderActions({ id, status, note }: { id: string; status: string; note: string }) {
  const router = useRouter();
  const [adminNote, setAdminNote] = useState(note);
  const [loading, setLoading] = useState("");

  async function setStatus(next: string) {
    setLoading(next);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next, adminNote }),
    });
    setLoading("");
    router.refresh();
  }

  return (
    <div className="mt-5 space-y-3">
      <textarea className="input min-h-20" value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="ملاحظة للإدارة" />
      <div className="grid gap-2 sm:grid-cols-3">
        <button disabled={!!loading} className="btn-outline" onClick={() => setStatus("PAYMENT_ACCEPTED")}>
          قبول الدفع
        </button>
        <button disabled={!!loading} className="btn-primary" onClick={() => setStatus("ACTIVATED")}>
          تفعيل الكورس
        </button>
        <button disabled={!!loading} className="btn bg-coral text-white" onClick={() => setStatus("REJECTED")}>
          رفض الطلب
        </button>
      </div>
      {status === "PAYMENT_ACCEPTED" && (
        <p className="text-sm text-navy/60">تم قبول الدفع. اضغط تفعيل الكورس ليظهر في حساب الطالب.</p>
      )}
    </div>
  );
}
