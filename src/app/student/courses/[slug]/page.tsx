import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isEnrolled } from "@/lib/access";

export default async function StudentCourse({ params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      units: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: {
            orderBy: { sortOrder: "asc" },
            include: {
              videos: true,
              files: true,
              quizzes: true,
              progress: { where: { userId: session.id } },
            },
          },
        },
      },
    },
  });
  if (!course) notFound();
  const enrolled = session.role === "ADMIN" || (await isEnrolled(session.id, course.id));
  const lessons = course.units.flatMap((u) => u.lessons);
  const done = lessons.filter((l) => l.progress.some((p) => p.completed)).length;
  const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;

  return (
    <div>
      <h1 className="section-title">{course.title}</h1>
      <p className="mt-2 font-bold text-teal">نسبة التقدم {pct}%</p>
      {!enrolled && (
        <p className="card mt-4 p-4 text-sm">
          هذا المحتوى يظهر بالكامل بعد تفعيل الكورس. الدروس المجانية فقط متاحة الآن.{" "}
          <Link href={`/book/${course.slug}`} className="font-black text-teal">
            احجز الآن
          </Link>
        </p>
      )}
      <div className="mt-6 space-y-4">
        {course.units.map((unit) => (
          <div key={unit.id} className="card p-4">
            <h2 className="font-black">{unit.title}</h2>
            <ul className="mt-2 space-y-2">
              {unit.lessons.map((l) => {
                const locked = !enrolled && !l.isFree;
                return (
                  <li key={l.id}>
                    {locked ? (
                      <div className="flex items-center justify-between rounded-2xl bg-sand px-3 py-3 text-navy/50">
                        <span>{l.title} · مقفل</span>
                      </div>
                    ) : (
                      <Link
                        href={`/student/courses/${course.slug}/lessons/${l.id}`}
                        className="flex items-center justify-between rounded-2xl bg-sand px-3 py-3 hover:bg-teal hover:text-white"
                      >
                        <span>
                          {l.title} {l.progress.some((p) => p.completed) ? "✓" : ""}
                        </span>
                        <span className="text-xs">
                          {l.videos.length} فيديو · {l.files.length} ملف · {l.quizzes.length} اختبار
                        </span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
