"use client";

import { useState } from "react";

export function LessonActions({
  lessonId,
  completed,
  quiz,
}: {
  lessonId: string;
  completed: boolean;
  quiz?: { id: string; title: string; questions: { id: string; question: string; options: string[] }[] };
}) {
  const [done, setDone] = useState(completed);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<string>("");

  async function mark() {
    await fetch("/api/student/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, completed: true }),
    });
    setDone(true);
  }

  async function submitQuiz() {
    const res = await fetch("/api/student/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: quiz?.id, answers }),
    });
    const data = await res.json();
    if (res.ok) {
      setResult(`النتيجة: ${data.score} من ${data.total}`);
      mark();
    }
  }

  return (
    <div className="card mt-6 p-4">
      {quiz && (
        <div className="mb-4">
          <h2 className="font-black">{quiz.title}</h2>
          {quiz.questions.map((q, qi) => (
            <div key={q.id} className="mt-3">
              <p className="font-bold">{q.question}</p>
              <div className="mt-2 space-y-1">
                {q.options.map((opt, oi) => (
                  <label key={oi} className="flex items-center gap-2 rounded-xl bg-sand px-3 py-2">
                    <input
                      type="radio"
                      name={q.id}
                      onChange={() => {
                        const next = [...answers];
                        next[qi] = oi;
                        setAnswers(next);
                      }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="btn-gold mt-4" onClick={submitQuiz}>
            إرسال الإجابات
          </button>
          {result && <p className="mt-2 font-bold text-teal">{result}</p>}
        </div>
      )}
      <button className="btn-primary" onClick={mark} disabled={done}>
        {done ? "تم إكمال الدرس" : "تعليم كدرس مكتمل"}
      </button>
    </div>
  );
}
