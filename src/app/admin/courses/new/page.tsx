import { prisma } from "@/lib/prisma";
import { CourseForm } from "@/components/admin/CourseForm";

export default async function NewCourse() {
  const [grades, categories] = await Promise.all([
    prisma.grade.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return (
    <CourseForm
      grades={grades.map((g) => ({ id: g.id, name: g.name }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
