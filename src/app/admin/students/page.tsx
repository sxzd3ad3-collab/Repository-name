import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StudentCreate } from "@/components/admin/StudentCreate";

export default async function StudentsPage() {
  const [students, grades] = await Promise.all([
    prisma.user.findMany({
      where: { role: "STUDENT" },
      include: { grade: true, enrollments: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.grade.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return (
    <div>
      <h1 className="section-title">الطلاب</h1>
      <StudentCreate grades={grades.map((g) => ({ id: g.id, name: g.name }))} />
      <div className="mt-5 space-y-2">
        {students.map((s) => (
          <Link key={s.id} href={`/admin/students/${s.id}`} className="card flex justify-between p-4">
            <div>
              <p className="font-black">{s.name}</p>
              <p className="text-sm text-navy/60">{s.phone} · {s.grade?.name || "بدون صف"}</p>
            </div>
            <div className="text-sm font-bold text-navy/50">
              {s.enrollments.length} كورس · {s.isActive ? "نشط" : "معطّل"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
