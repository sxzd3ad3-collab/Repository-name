import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { CourseCard } from "@/components/CourseCard";

export default async function GradePage({ params }: { params: { slug: string } }) {
  const grade = await prisma.grade.findUnique({
    where: { slug: params.slug },
    include: {
      stage: true,
      courses: {
        where: { isPublished: true },
        include: { grade: true, category: true, units: { include: { lessons: true } } },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  if (!grade) notFound();
  return (
    <PublicShell>
      <div className="container-site py-8">
        <p className="text-sm font-bold text-teal">{grade.stage.name}</p>
        <h1 className="section-title">{grade.name}</h1>
        {grade.courses.length === 0 ? (
          <p className="mt-8 card p-8 text-center text-navy/60">لا توجد كورسات لهذا الصف حتى الآن.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grade.courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
