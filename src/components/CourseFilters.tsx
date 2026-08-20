"use client";

import { useRouter } from "next/navigation";
import { CourseCard, type CourseCardData } from "./CourseCard";

type Stage = {
  slug: string;
  name: string;
  grades: { slug: string; name: string }[];
};

export function CourseFilters({
  stages,
  categories,
  courses,
  current,
}: {
  stages: Stage[];
  categories: { slug: string; name: string }[];
  courses: CourseCardData[];
  current: Record<string, string | undefined>;
}) {
  const router = useRouter();

  function update(key: string, value: string) {
    const params = new URLSearchParams();
    Object.entries(current).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === "stage") params.delete("grade");
    router.push(`/courses?${params.toString()}`);
  }

  return (
    <div className="mt-6">
      <form
        className="mb-4"
        action="/courses"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new FormData(e.currentTarget).get("q") as string;
          update("q", q || "");
        }}
      >
        <input
          name="q"
          defaultValue={current.q || ""}
          className="input"
          placeholder="ابحث عن كورس أو صف أو مهارة..."
        />
      </form>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <select className="input" value={current.stage || ""} onChange={(e) => update("stage", e.target.value)}>
          <option value="">كل المراحل</option>
          {stages.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <select className="input" value={current.grade || ""} onChange={(e) => update("grade", e.target.value)}>
          <option value="">كل الصفوف</option>
          {stages.flatMap((s) =>
            (!current.stage || s.slug === current.stage ? s.grades : []).map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name}
              </option>
            ))
          )}
        </select>
        <select className="input" value={current.type || ""} onChange={(e) => update("type", e.target.value)}>
          <option value="">نوع الكورس</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="input" value={current.level || ""} onChange={(e) => update("level", e.target.value)}>
          <option value="">المستوى</option>
          <option value="مبتدئ">مبتدئ</option>
          <option value="متوسط">متوسط</option>
          <option value="متقدم">متقدم</option>
          <option value="تأسيس">تأسيس</option>
        </select>
        <select className="input" value={current.price || ""} onChange={(e) => update("price", e.target.value)}>
          <option value="">السعر</option>
          <option value="400-600">400–600 جنيه</option>
          <option value="600-800">600–800 جنيه</option>
          <option value="800-1200">800–1200 جنيه</option>
        </select>
      </div>
      {courses.length === 0 ? (
        <p className="card p-8 text-center text-navy/60">لا توجد كورسات مطابقة للبحث.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
