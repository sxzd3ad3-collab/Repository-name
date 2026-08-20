import { prisma } from "./prisma";

export async function isEnrolled(userId: string, courseId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  return Boolean(enrollment && enrollment.status === "ACTIVE");
}

export async function canAccessLesson(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { unit: true },
  });
  if (!lesson) return { ok: false as const, lesson: null, courseId: null };
  if (lesson.isFree) return { ok: true as const, lesson, courseId: lesson.unit.courseId };
  const enrolled = await isEnrolled(userId, lesson.unit.courseId);
  return { ok: enrolled, lesson, courseId: lesson.unit.courseId };
}
