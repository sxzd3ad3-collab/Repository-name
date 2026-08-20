import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";

export const metadata = { title: "المراحل الدراسية" };

export default async function GradesPage() {
  const stages = await prisma.stage.findMany({
    include: { grades: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <PublicShell>
      <div className="container-site py-8">
        <h1 className="section-title">المراحل الدراسية</h1>
        <p className="mt-2 text-navy/60">اختر الصف لعرض الكورسات الخاصة به.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {stages.map((stage) => (
            <section key={stage.id} className="card p-5">
              <h2 className="text-xl font-black text-ink">{stage.name}</h2>
              <div className="mt-4 flex flex-col gap-2">
                {stage.grades.map((g) => (
                  <Link
                    key={g.id}
                    href={`/grades/${g.slug}`}
                    className="rounded-2xl bg-sand px-4 py-3 font-bold text-navy hover:bg-teal hover:text-white"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
