import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { CourseCard } from "@/components/CourseCard";

export default async function SkillPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  const courses = await prisma.course.findMany({
    where: { isPublished: true, category: { slug: params.slug } },
    include: { category: true, units: { include: { lessons: true } } },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <PublicShell>
      <div className="container-site py-8">
        <h1 className="section-title">{category?.nameEn || category?.name || params.slug}</h1>
        <p className="mt-2 text-navy/60">{category?.description}</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
