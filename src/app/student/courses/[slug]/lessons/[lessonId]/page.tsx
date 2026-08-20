import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLesson, isEnrolled } from "@/lib/access";
import { youtubeEmbed } from "@/lib/utils";
import { LessonActions } from "@/components/student/LessonActions";

export default async function LessonPage({
  params,
}: {
  params: { slug: string; lessonId: string };
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const access = await canAccessLesson(session.id, params.lessonId);
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      videos: { orderBy: { sortOrder: "asc" } },
      files: true,
      quizzes: { include: { questions: { orderBy: { sortOrder: "asc" } } } },
      unit: { include: { course: { include: { units: { include: { lessons: { orderBy: { sortOrder: "asc" } } } } } } } },
      progress: { where: { userId: session.id } },
    },
  });
  if (!lesson || lesson.unit.course.slug !== params.slug) notFound();
  const enrolled = session.role === "ADMIN" || (await isEnrolled(session.id, lesson.unit.courseId));
  if (!access.ok && session.role !== "ADMIN" && !lesson.isFree) {
    return (
      <div className="card p-6 text-center">
        <p className="font-black">هذا الدرس متاح بعد تفعيل الكورس.</p>
        <Link href={`/book/${params.slug}`} className="btn-primary mt-4">
          احجز الكورس الآن
        </Link>
      </div>
    );
  }

  const all = lesson.unit.course.units.flatMap((u) => u.lessons);
  const idx = all.findIndex((l) => l.id === lesson.id);
  const prev = all[idx - 1];
  const next = all[idx + 1];

  return (
    <div>
      <p className="text-sm font-bold text-teal">{lesson.unit.course.title}</p>
      <h1 className="section-title">{lesson.title}</h1>
      {lesson.content && <p className="mt-3 leading-8 text-navy/75">{lesson.content}</p>}

      <div className="mt-6 space-y-5">
        {lesson.videos.map((v) => {
          const embed = youtubeEmbed(v.youtubeUrl);
          return (
            <div key={v.id} className="card overflow-hidden">
              <p className="p-3 font-bold">{v.title}</p>
              {embed ? (
                <div className="aspect-video">
                  <iframe
                    src={embed}
                    title={v.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : v.filePath ? (
                <video src={`/api/media/video/${v.id}`} controls playsInline className="w-full" />
              ) : (
                <p className="p-4 text-navy/50">لا يوجد مصدر للفيديو.</p>
              )}
            </div>
          );
        })}
      </div>

      {lesson.files.length > 0 && (
        <div className="mt-6 card p-4">
          <h2 className="font-black">الملفات</h2>
          <ul className="mt-2 space-y-2">
            {lesson.files.map((f) => (
              <li key={f.id}>
                <a href={`/api/media/file/${f.id}`} className="font-bold text-teal" target="_blank" rel="noreferrer">
                  {f.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {lesson.quizzes.map((quiz) => (
        <LessonActions
          key={quiz.id}
          lessonId={lesson.id}
          completed={lesson.progress.some((p) => p.completed)}
          quiz={{
            id: quiz.id,
            title: quiz.title,
            questions: quiz.questions.map((q) => ({
              id: q.id,
              question: q.question,
              options: JSON.parse(q.options) as string[],
            })),
          }}
        />
      ))}
      {lesson.quizzes.length === 0 && (
        <LessonActions lessonId={lesson.id} completed={lesson.progress.some((p) => p.completed)} />
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        {prev ? (
          <Link href={`/student/courses/${params.slug}/lessons/${prev.id}`} className="btn-outline">
            الدرس السابق
          </Link>
        ) : (
          <span />
        )}
        {next && (enrolled || next.isFree) ? (
          <Link href={`/student/courses/${params.slug}/lessons/${next.id}`} className="btn-primary">
            الدرس التالي
          </Link>
        ) : (
          <Link href={`/student/courses/${params.slug}`} className="btn-outline">
            رجوع للكورس
          </Link>
        )}
      </div>
    </div>
  );
}
