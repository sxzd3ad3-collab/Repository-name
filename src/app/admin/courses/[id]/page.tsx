import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseForm } from "@/components/admin/CourseForm";
import { CourseContentManager } from "@/components/admin/CourseContentManager";

export default async function EditCourse({ params }: { params: { id: string } }) {
  const [course, grades, categories] = await Promise.all([
    prisma.course.findUnique({
      where: { id: params.id },
      include: {
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
    }),
    prisma.grade.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!course) notFound();
  return (
    <div className="space-y-8">
      <CourseForm
        course={course}
        grades={grades.map((g) => ({ id: g.id, name: g.name }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
      <CourseContentManager course={course} />
    </div>
  );
}
