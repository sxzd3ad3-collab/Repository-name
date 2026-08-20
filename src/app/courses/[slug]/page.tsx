import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { countFiles, countLessons, countQuizzes, countVideos, formatPrice, parseJsonArray } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { isEnrolled } from "@/lib/access";

export default async function CourseDetails({ params }: { params: { slug: string } }) {
  const course = await prisma.course.findUnique({
    where: { slug: params.slug },
    include: {
      grade: true,
      category: true,
      units: {
        orderBy: { sortOrder: "asc" },
        include: {
          lessons: {
            orderBy: { sortOrder: "asc" },
            include: { videos: true, files: true, quizzes: true },
          },
        },
      },
    },
  });
  if (!course || !course.isPublished) notFound();

  const session = await getSession();
  const enrolled = session ? await isEnrolled(session.id, course.id) : false;
  const outcomes = parseJsonArray(course.learningOutcomes);

  return (
    <PublicShell>
      <div className="container-site py-8">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
          <div>
            <img
              src={course.image || "/covers/primary-4.svg"}
              alt=""
              className="mb-5 aspect-[16/9] w-full rounded-3xl object-cover"
            />
            <p className="text-sm font-bold text-teal">
              {course.grade?.name || course.category?.name} · {course.level}
            </p>
            <h1 className="mt-1 text-3xl font-black text-ink">{course.title}</h1>
            <p className="mt-3 leading-8 text-navy/75">{course.fullDescription}</p>

            <h2 className="mt-8 text-xl font-black">لمن هذا الكورس؟</h2>
            <p className="mt-2 leading-8 text-navy/75">{course.targetAudience}</p>

            <h2 className="mt-8 text-xl font-black">ماذا سيتعلم الطالب؟</h2>
            <ul className="mt-3 space-y-2">
              {outcomes.map((o) => (
                <li key={o} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-navy">
                  {o}
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-xl font-black">محتويات الكورس</h2>
            <div className="mt-3 space-y-3">
              {course.units.map((u) => (
                <div key={u.id} className="card p-4">
                  <p className="font-black text-ink">{u.title}</p>
                  <ul className="mt-2 space-y-1 text-sm text-navy/70">
                    {u.lessons.map((l) => (
                      <li key={l.id} className="flex justify-between gap-2">
                        <span>
                          {l.title} {l.isFree ? <span className="text-leaf">· مجاني</span> : ""}
                        </span>
                        <span>
                          {l.videos.length} فيديو · {l.files.length} ملف · {l.quizzes.length} اختبار
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <aside className="card h-fit p-5 lg:sticky lg:top-24">
            <p className="text-3xl font-black text-teal">{formatPrice(course.price)}</p>
            <ul className="mt-4 space-y-2 text-sm font-bold text-navy/70">
              <li>عدد الدروس: {countLessons(course)}</li>
              <li>عدد الفيديوهات: {countVideos(course)}</li>
              <li>الملفات: {countFiles(course)}</li>
              <li>الاختبارات: {countQuizzes(course)}</li>
              <li>المدة: {course.duration}</li>
            </ul>
            {enrolled ? (
              <Link href={`/student/courses/${course.slug}`} className="btn-primary mt-5 w-full">
                متابعة التعلم
              </Link>
            ) : (
              <Link href={`/book/${course.slug}`} className="btn-primary mt-5 w-full">
                احجز الكورس الآن
              </Link>
            )}
            {!session && (
              <p className="mt-3 text-center text-xs text-navy/50">
                يُفضل{" "}
                <Link href="/register" className="font-bold text-teal">
                  إنشاء حساب
                </Link>{" "}
                قبل الحجز حتى يظهر الكورس تلقائيًا بعد التفعيل.
              </p>
            )}
          </aside>
        </div>
      </div>
    </PublicShell>
  );
}
