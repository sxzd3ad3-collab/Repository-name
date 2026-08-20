import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { CourseCard } from "@/components/CourseCard";

export default async function ConversationLevelPage({ params }: { params: { level: string } }) {
  const level = params.level.toUpperCase();
  const courses = await prisma.course.findMany({
    where: { isPublished: true, conversationLevel: level },
    include: { category: true, units: { include: { lessons: true } } },
  });
  return (
    <PublicShell>
      <div className="container-site py-8">
        <h1 className="section-title">English Conversation {level}</h1>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
        {courses.length === 0 && <p className="mt-8 text-navy/60">لا توجد كورسات لهذا المستوى بعد.</p>}
      </div>
    </PublicShell>
  );
}
