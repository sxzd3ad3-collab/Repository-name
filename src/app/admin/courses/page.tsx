import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminCourses() {
  const courses = await prisma.course.findMany({
    include: { grade: true, category: true, _count: { select: { units: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="section-title">الكورسات</h1>
        <Link href="/admin/courses/new" className="btn-primary">
          إضافة كورس
        </Link>
      </div>
      <div className="mt-5 space-y-2">
        {courses.map((c) => (
          <Link key={c.id} href={`/admin/courses/${c.id}`} className="card flex justify-between p-4">
            <div>
              <p className="font-black">{c.title}</p>
              <p className="text-sm text-navy/60">
                {c.grade?.name || c.category?.name} · {c._count.units} وحدات
              </p>
            </div>
            <span className="font-black text-teal">{formatPrice(c.price)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
