import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { CourseCard } from "@/components/CourseCard";

export const metadata = { title: "BrightStart Phonics" };

const topics = [
  "Alphabet",
  "Letter Sounds",
  "Phonics",
  "CVC Words",
  "Short Vowels",
  "Reading",
  "Vocabulary",
  "Writing",
  "Worksheets",
  "Quizzes",
];

export default async function PhonicsPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true, category: { slug: "phonics" } },
    include: { category: true, units: { include: { lessons: true } } },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <PublicShell>
      <div className="bg-gradient-to-l from-amber to-coral py-10 text-ink">
        <div className="container-site">
          <p className="font-black">للأطفال</p>
          <h1 className="text-3xl font-black sm:text-4xl">BrightStart Phonics</h1>
          <p className="mt-2 max-w-2xl font-bold text-ink/70">
            تأسيس ممتع وواضح. يمكن إضافة الدروس والفيديوهات والملفات من لوحة التحكم.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {topics.map((t) => (
              <span key={t} className="rounded-full bg-white px-3 py-1 text-sm font-black">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="container-site py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
