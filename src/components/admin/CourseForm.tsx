"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { parseJsonArray } from "@/lib/utils";

type Course = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience: string;
  learningOutcomes: string;
  image: string | null;
  price: number;
  duration: string;
  level: string;
  gradeId: string | null;
  categoryId: string | null;
  conversationLevel: string | null;
  isPublished: boolean;
  isFeatured: boolean;
};

export function CourseForm({
  course,
  grades,
  categories,
}: {
  course?: Course;
  grades: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [image, setImage] = useState(course?.image || "");

  async function uploadImage(file: File) {
    const data = new FormData();
    data.set("file", file);
    data.set("folder", "covers");
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = await res.json();
    if (json.url) setImage(json.url);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      slug: form.get("slug"),
      shortDescription: form.get("shortDescription"),
      fullDescription: form.get("fullDescription"),
      targetAudience: form.get("targetAudience"),
      learningOutcomes: form.get("learningOutcomes"),
      image,
      price: Number(form.get("price")),
      duration: form.get("duration"),
      level: form.get("level"),
      gradeId: form.get("gradeId"),
      categoryId: form.get("categoryId"),
      conversationLevel: form.get("conversationLevel"),
      isPublished: form.get("isPublished") === "on",
      isFeatured: form.get("isFeatured") === "on",
    };
    const res = await fetch(course ? `/api/admin/courses/${course.id}` : "/api/admin/courses", {
      method: course ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "خطأ");
      return;
    }
    router.push(`/admin/courses/${data.course.id}`);
    router.refresh();
  }

  async function remove() {
    if (!course || !confirm("حذف الكورس نهائيًا؟")) return;
    await fetch(`/api/admin/courses/${course.id}`, { method: "DELETE" });
    router.push("/admin/courses");
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-3 p-5">
      <h1 className="text-xl font-black">{course ? "تعديل الكورس" : "إضافة كورس"}</h1>
      <input name="title" className="input" placeholder="اسم الكورس" defaultValue={course?.title} required />
      <input name="slug" className="input" placeholder="المسار (اختياري)" defaultValue={course?.slug} />
      <textarea name="shortDescription" className="input min-h-20" placeholder="وصف مختصر" defaultValue={course?.shortDescription} />
      <textarea name="fullDescription" className="input min-h-28" placeholder="وصف كامل" defaultValue={course?.fullDescription} />
      <textarea name="targetAudience" className="input min-h-20" placeholder="لمن هذا الكورس؟" defaultValue={course?.targetAudience} />
      <textarea
        name="learningOutcomes"
        className="input min-h-24"
        placeholder="ماذا سيتعلم الطالب؟ سطر لكل نقطة"
        defaultValue={course ? parseJsonArray(course.learningOutcomes).join("\n") : ""}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <input name="price" type="number" className="input" placeholder="السعر" defaultValue={course?.price ?? 400} />
        <input name="duration" className="input" placeholder="المدة" defaultValue={course?.duration} />
        <input name="level" className="input" placeholder="المستوى" defaultValue={course?.level} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <select name="gradeId" className="input" defaultValue={course?.gradeId || ""}>
          <option value="">بدون صف</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <select name="categoryId" className="input" defaultValue={course?.categoryId || ""}>
          <option value="">بدون تصنيف</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input name="conversationLevel" className="input" placeholder="مستوى المحادثة A1-C2" defaultValue={course?.conversationLevel || ""} />
      </div>
      <div>
        <label className="label">صورة الكورس</label>
        {image && <img src={image} alt="" className="mb-2 h-28 rounded-2xl object-cover" />}
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
      </div>
      <label className="flex items-center gap-2 font-bold">
        <input type="checkbox" name="isPublished" defaultChecked={course?.isPublished ?? true} /> منشور
      </label>
      <label className="flex items-center gap-2 font-bold">
        <input type="checkbox" name="isFeatured" defaultChecked={course?.isFeatured} /> مميز في الرئيسية
      </label>
      {err && <p className="text-coral">{err}</p>}
      <div className="flex gap-2">
        <button className="btn-primary">حفظ</button>
        {course && (
          <button type="button" className="btn bg-coral text-white" onClick={remove}>
            حذف الكورس
          </button>
        )}
      </div>
    </form>
  );
}
