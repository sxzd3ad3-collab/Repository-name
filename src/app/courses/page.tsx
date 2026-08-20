import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { CourseFilters } from "@/components/CourseFilters";

export const metadata = { title: "الكورسات" };

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    stage?: string;
    grade?: string;
    type?: string;
    level?: string;
    price?: string;
  };
}) {
  const { q, stage, grade, type, level, price } = searchParams;
  const [stages, categories, courses] = await Promise.all([
    prisma.stage.findMany({
      include: { grades: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.course.findMany({
      where: {
        isPublished: true,
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { shortDescription: { contains: q } },
                { level: { contains: q } },
                { grade: { name: { contains: q } } },
                { category: { name: { contains: q } } },
              ],
            }
          : {}),
        ...(grade ? { grade: { slug: grade } } : {}),
        ...(stage ? { grade: { stage: { slug: stage } } } : {}),
        ...(type ? { category: { slug: type } } : {}),
        ...(level ? { level: { contains: level } } : {}),
        ...(price === "400-600" ? { price: { gte: 400, lte: 600 } } : {}),
        ...(price === "600-800" ? { price: { gte: 600, lte: 800 } } : {}),
        ...(price === "800-1200" ? { price: { gte: 800, lte: 1200 } } : {}),
      },
      include: {
        grade: true,
        category: true,
        units: { include: { lessons: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { price: "asc" }],
    }),
  ]);

  return (
    <PublicShell>
      <div className="container-site py-8">
        <h1 className="section-title">الكورسات المتاحة</h1>
        <p className="mt-2 text-navy/60">ابحث بالاسم أو الصف أو المهارة أو المستوى.</p>
        <CourseFilters
          stages={stages}
          categories={categories}
          courses={courses}
          current={{ q, stage, grade, type, level, price }}
        />
      </div>
    </PublicShell>
  );
}
