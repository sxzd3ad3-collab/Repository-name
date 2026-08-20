import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function StudentHome() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              units: { include: { lessons: { include: { progress: { where: { userId: session.id } } } } } },
            },
          },
        },
      },
      orders: { orderBy: { createdAt: "desc" }, take: 5, include: { course: true } },
    },
  });
  const lastLesson = user?.lastLessonId
    ? await prisma.lesson.findUnique({
        where: { id: user.lastLessonId },
        include: { unit: { include: { course: true } } },
      })
    : null;

  return (
    <div>
      <h1 className="section-title">مرحبًا {session.name}</h1>
      <p className="mt-1 text-navy/60">الكورسات الخاصة بي والكورسات المفعلة.</p>

      {lastLesson && (
        <Link
          href={`/student/courses/${lastLesson.unit.course.slug}/lessons/${lastLesson.id}`}
          className="card mt-5 block p-5"
        >
          <p className="text-sm font-bold text-teal">آخر درس شاهدته</p>
          <p className="mt-1 font-black">{lastLesson.title}</p>
          <p className="text-sm text-navy/60">{lastLesson.unit.course.title}</p>
          <span className="btn-primary mt-3 inline-flex">متابعة التعلم</span>
        </Link>
      )}

      <h2 className="mt-8 text-xl font-black">كورساتي</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {user?.enrollments.map((e) => {
          const lessons = e.course.units.flatMap((u) => u.lessons);
          const done = lessons.filter((l) => l.progress.some((p) => p.completed)).length;
          const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
          return (
            <Link key={e.id} href={`/student/courses/${e.course.slug}`} className="card p-4">
              <p className="font-black">{e.course.title}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand">
                <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-sm font-bold text-navy/60">نسبة التقدم {pct}%</p>
            </Link>
          );
        })}
        {user?.enrollments.length === 0 && (
          <p className="card p-6 text-navy/60">لا توجد كورسات مفعلة بعد. احجز كورسًا وانتظر تأكيد الدفع.</p>
        )}
      </div>
    </div>
  );
}
