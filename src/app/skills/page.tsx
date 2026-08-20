import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { CourseCard } from "@/components/CourseCard";

export const metadata = { title: "جميع المهارات" };

export default async function SkillsPage() {
  const categories = await prisma.category.findMany({
    where: { type: { in: ["SKILL", "CONVERSATION", "PHONICS"] } },
    orderBy: { sortOrder: "asc" },
  });
  const courses = await prisma.course.findMany({
    where: { isPublished: true, category: { type: { in: ["SKILL", "CONVERSATION", "PHONICS"] } } },
    include: { category: true, units: { include: { lessons: true } } },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <PublicShell>
      <div className="container-site py-8">
        <h1 className="section-title">جميع المهارات</h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link key={c.id} href={`/skills/${c.slug}`} className="chip !px-4 !py-2 text-sm">
              {c.nameEn || c.name}
            </Link>
          ))}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
