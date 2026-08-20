import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StudentEditor } from "@/components/admin/StudentEditor";

export default async function StudentDetails({ params }: { params: { id: string } }) {
  const [user, grades, courses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: params.id },
      include: {
        grade: true,
        enrollments: { include: { course: true } },
        orders: { include: { course: true }, orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.grade.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.course.findMany({ orderBy: { title: "asc" } }),
  ]);
  if (!user) notFound();
  return (
    <StudentEditor
      user={{
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        isActive: user.isActive,
        gradeId: user.gradeId,
        enrollments: user.enrollments.map((e) => ({ id: e.id, courseId: e.courseId, title: e.course.title })),
        orders: user.orders.map((o) => ({ id: o.id, title: o.course.title, status: o.status })),
      }}
      grades={grades.map((g) => ({ id: g.id, name: g.name }))}
      courses={courses.map((c) => ({ id: c.id, title: c.title }))}
    />
  );
}
