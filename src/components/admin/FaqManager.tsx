"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function FaqManager({ faqs }: { faqs: { id: string; question: string; answer: string }[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  return (
    <div className="mt-5 space-y-4">
      <div className="card space-y-2 p-4">
        <input className="input" placeholder="السؤال" value={q} onChange={(e) => setQ(e.target.value)} />
        <textarea className="input min-h-20" placeholder="الإجابة" value={a} onChange={(e) => setA(e.target.value)} />
        <button
          className="btn-primary"
          onClick={async () => {
            await fetch("/api/admin/faqs", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ question: q, answer: a }),
            });
            setQ("");
            setA("");
            router.refresh();
          }}
        >
          إضافة سؤال
        </button>
      </div>
      {faqs.map((f) => (
        <FaqRow key={f.id} faq={f} onChange={() => router.refresh()} />
      ))}
    </div>
  );
}

function FaqRow({ faq, onChange }: { faq: { id: string; question: string; answer: string }; onChange: () => void }) {
  const [question, setQuestion] = useState(faq.question);
  const [answer, setAnswer] = useState(faq.answer);
  return (
    <div className="card space-y-2 p-4">
      <input className="input" value={question} onChange={(e) => setQuestion(e.target.value)} />
      <textarea className="input min-h-20" value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <div className="flex gap-2">
        <button
          className="btn-outline"
          onClick={async () => {
            await fetch(`/api/admin/faqs/${faq.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ question, answer }),
            });
            onChange();
          }}
        >
          حفظ
        </button>
        <button
          className="text-coral"
          onClick={async () => {
            await fetch(`/api/admin/faqs/${faq.id}`, { method: "DELETE" });
            onChange();
          }}
        >
          حذف
        </button>
      </div>
    </div>
  );
}
