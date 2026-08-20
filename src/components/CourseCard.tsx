import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export type CourseCardData = {
  slug: string;
  title: string;
  shortDescription: string;
  image: string | null;
  price: number;
  duration: string;
  level: string;
  grade?: { name: string } | null;
  category?: { name: string } | null;
  conversationLevel?: string | null;
  _count?: { units: number };
  units?: { lessons: unknown[] }[];
};

export function CourseCard({
  course,
  lessonCount,
}: {
  course: CourseCardData;
  lessonCount?: number;
}) {
  const lessons =
    lessonCount ??
    course.units?.reduce((n, u) => n + u.lessons.length, 0) ??
    0;
  const audience =
    course.grade?.name ||
    course.conversationLevel ||
    course.category?.name ||
    "عام";

  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] bg-navy">
        <img
          src={course.image || "/covers/primary-4.svg"}
          alt=""
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-sm font-black text-teal">
          {formatPrice(course.price)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="chip">{audience}</span>
          <span className="chip">{course.level}</span>
        </div>
        <h3 className="text-lg font-black text-ink">{course.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-navy/70">
          {course.shortDescription}
        </p>
        <p className="mt-3 text-xs font-bold text-navy/50">
          {lessons} درس · {course.duration}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link href={`/courses/${course.slug}`} className="btn-outline !py-2.5 text-sm">
            عرض التفاصيل
          </Link>
          <Link href={`/book/${course.slug}`} className="btn-primary !py-2.5 text-sm">
            احجز الآن
          </Link>
        </div>
      </div>
    </article>
  );
}
