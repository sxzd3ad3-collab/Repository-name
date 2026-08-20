import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { CourseCard } from "@/components/CourseCard";

export const metadata = { title: "English Conversation" };

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default async function ConversationPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true, category: { slug: "conversation" } },
    include: { category: true, units: { include: { lessons: true } } },
    orderBy: { conversationLevel: "asc" },
  });
  return (
    <PublicShell>
      <div className="bg-navy py-10 text-white">
        <div className="container-site">
          <h1 className="text-3xl font-black">English Conversation Course</h1>
          <p className="mt-2 max-w-2xl text-white/75">
            مستويات من A1 إلى C2. يمكن إضافة Stories وVocabulary وSpeaking Practice وQuestions وLessons من لوحة التحكم.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {levels.map((l) => (
              <Link key={l} href={`/conversation/${l.toLowerCase()}`} className="rounded-full bg-white/10 px-4 py-2 font-black">
                {l}
              </Link>
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
