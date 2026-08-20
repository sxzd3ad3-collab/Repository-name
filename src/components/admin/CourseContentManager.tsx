"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Lesson = {
  id: string;
  title: string;
  content: string;
  isFree: boolean;
  videos: { id: string; title: string; youtubeUrl: string | null }[];
  files: { id: string; title: string }[];
  quizzes: { id: string; title: string }[];
};
type Unit = { id: string; title: string; lessons: Lesson[] };
type Course = { id: string; units: Unit[] };

export function CourseContentManager({ course }: { course: Course }) {
  const router = useRouter();
  const [unitTitle, setUnitTitle] = useState("");

  async function addUnit() {
    if (!unitTitle.trim()) return;
    await fetch(`/api/admin/courses/${course.id}/units`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: unitTitle }),
    });
    setUnitTitle("");
    router.refresh();
  }

  return (
    <section className="card p-5">
      <h2 className="text-xl font-black">الوحدات والدروس</h2>
      <div className="mt-3 flex gap-2">
        <input className="input" placeholder="اسم وحدة جديدة" value={unitTitle} onChange={(e) => setUnitTitle(e.target.value)} />
        <button className="btn-gold shrink-0" onClick={addUnit}>
          إضافة وحدة
        </button>
      </div>
      <div className="mt-5 space-y-5">
        {course.units.map((unit) => (
          <UnitBlock key={unit.id} unit={unit} onChange={() => router.refresh()} />
        ))}
      </div>
    </section>
  );
}

function UnitBlock({ unit, onChange }: { unit: Unit; onChange: () => void }) {
  const [lessonTitle, setLessonTitle] = useState("");
  async function addLesson() {
    if (!lessonTitle.trim()) return;
    await fetch(`/api/admin/units/${unit.id}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: lessonTitle }),
    });
    setLessonTitle("");
    onChange();
  }
  return (
    <div className="rounded-3xl bg-sand p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="font-black">{unit.title}</p>
        <button
          className="text-sm text-coral"
          onClick={async () => {
            if (!confirm("حذف الوحدة؟")) return;
            await fetch(`/api/admin/units/${unit.id}`, { method: "DELETE" });
            onChange();
          }}
        >
          حذف الوحدة
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <input className="input" placeholder="درس جديد" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} />
        <button className="btn-outline shrink-0" onClick={addLesson}>
          إضافة درس
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {unit.lessons.map((lesson) => (
          <LessonBlock key={lesson.id} lesson={lesson} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}

function LessonBlock({ lesson, onChange }: { lesson: Lesson; onChange: () => void }) {
  const [yt, setYt] = useState("");
  const [quizTitle, setQuizTitle] = useState("اختبار سريع");

  async function addYoutube() {
    if (!yt.trim()) return;
    await fetch(`/api/admin/lessons/${lesson.id}/videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "فيديو", youtubeUrl: yt }),
    });
    setYt("");
    onChange();
  }

  async function addFile(file: File, title: string) {
    const data = new FormData();
    data.set("title", title || file.name);
    data.set("file", file);
    await fetch(`/api/admin/lessons/${lesson.id}/files`, { method: "POST", body: data });
    onChange();
  }

  async function addVideoFile(file: File) {
    const data = new FormData();
    data.set("title", file.name);
    data.set("file", file);
    await fetch(`/api/admin/lessons/${lesson.id}/videos`, { method: "POST", body: data });
    onChange();
  }

  async function addQuiz() {
    await fetch(`/api/admin/lessons/${lesson.id}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: quizTitle,
        questions: [
          { question: "سؤال تجريبي — عدّله لاحقًا", options: ["إجابة صحيحة", "خطأ", "خطأ", "خطأ"], correctIndex: 0 },
        ],
      }),
    });
    onChange();
  }

  return (
    <div className="rounded-2xl bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-bold">{lesson.title}</p>
        <div className="flex gap-2 text-sm">
          <button
            className="text-teal"
            onClick={async () => {
              await fetch(`/api/admin/lessons/${lesson.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFree: !lesson.isFree }),
              });
              onChange();
            }}
          >
            {lesson.isFree ? "مجاني" : "مدفوع"}
          </button>
          <button
            className="text-coral"
            onClick={async () => {
              await fetch(`/api/admin/lessons/${lesson.id}`, { method: "DELETE" });
              onChange();
            }}
          >
            حذف
          </button>
        </div>
      </div>
      <p className="mt-1 text-xs text-navy/50">
        فيديوهات: {lesson.videos.length} · ملفات: {lesson.files.length} · اختبارات: {lesson.quizzes.length}
      </p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div className="flex gap-1">
          <input className="input !py-2" placeholder="رابط يوتيوب" value={yt} onChange={(e) => setYt(e.target.value)} />
          <button className="btn-outline !px-3 !py-2 text-sm" onClick={addYoutube}>
            فيديو
          </button>
        </div>
        <label className="btn-outline !py-2 text-sm">
          رفع فيديو
          <input type="file" accept="video/*" className="hidden" onChange={(e) => e.target.files?.[0] && addVideoFile(e.target.files[0])} />
        </label>
        <label className="btn-outline !py-2 text-sm">
          رفع PDF / ملف
          <input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && addFile(e.target.files[0], e.target.files[0].name)} />
        </label>
        <button className="btn-outline !py-2 text-sm" onClick={addQuiz}>
          إضافة اختبار
        </button>
      </div>
      {lesson.videos.map((v) => (
        <div key={v.id} className="mt-1 flex justify-between text-xs">
          <span>{v.title} {v.youtubeUrl ? "(يوتيوب)" : "(ملف)"}</span>
          <button className="text-coral" onClick={async () => { await fetch(`/api/admin/videos/${v.id}`, { method: "DELETE" }); onChange(); }}>حذف</button>
        </div>
      ))}
      {lesson.files.map((f) => (
        <div key={f.id} className="mt-1 flex justify-between text-xs">
          <span>{f.title}</span>
          <button className="text-coral" onClick={async () => { await fetch(`/api/admin/files/${f.id}`, { method: "DELETE" }); onChange(); }}>حذف</button>
        </div>
      ))}
    </div>
  );
}
