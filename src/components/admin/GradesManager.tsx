"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GradesManager({
  stages,
  categories,
}: {
  stages: { id: string; name: string; grades: { id: string; name: string }[] }[];
  categories: { id: string; name: string; type: string }[];
}) {
  const router = useRouter();
  const [stageName, setStageName] = useState("");
  const [gradeName, setGradeName] = useState("");
  const [stageId, setStageId] = useState(stages[0]?.id || "");
  const [catName, setCatName] = useState("");
  const [catType, setCatType] = useState("SKILL");

  async function post(body: Record<string, string>) {
    await fetch("/api/admin/grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  }

  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <div className="card p-5">
        <h2 className="font-black">المراحل والصفوف</h2>
        {stages.map((s) => (
          <div key={s.id} className="mt-3">
            <p className="font-bold text-teal">{s.name}</p>
            <ul className="mt-1 text-sm">
              {s.grades.map((g) => (
                <li key={g.id}>{g.name}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mt-4 flex gap-2">
          <input className="input" placeholder="مرحلة جديدة" value={stageName} onChange={(e) => setStageName(e.target.value)} />
          <button className="btn-gold" onClick={() => post({ kind: "stage", name: stageName })}>
            إضافة
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <select className="input" value={stageId} onChange={(e) => setStageId(e.target.value)}>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input className="input" placeholder="صف جديد" value={gradeName} onChange={(e) => setGradeName(e.target.value)} />
          <button className="btn-outline" onClick={() => post({ kind: "grade", name: gradeName, stageId })}>
            إضافة
          </button>
        </div>
      </div>
      <div className="card p-5">
        <h2 className="font-black">التصنيفات</h2>
        <ul className="mt-3 space-y-1 text-sm">
          {categories.map((c) => (
            <li key={c.id}>
              {c.name} <span className="text-navy/40">({c.type})</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2">
          <input className="input" placeholder="اسم التصنيف" value={catName} onChange={(e) => setCatName(e.target.value)} />
          <select className="input" value={catType} onChange={(e) => setCatType(e.target.value)}>
            <option value="SKILL">مهارة</option>
            <option value="PHONICS">فونكس</option>
            <option value="CONVERSATION">محادثة</option>
            <option value="GRADE">مرحلة</option>
          </select>
          <button className="btn-primary" onClick={() => post({ kind: "category", name: catName, type: catType })}>
            إضافة تصنيف
          </button>
        </div>
      </div>
    </div>
  );
}
