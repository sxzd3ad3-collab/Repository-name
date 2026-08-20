import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { BookingWizard } from "@/components/BookingWizard";
import { formatPrice } from "@/lib/utils";

export default async function BookPage({ params }: { params: { slug: string } }) {
  const [course, session, settings, grades] = await Promise.all([
    prisma.course.findUnique({
      where: { slug: params.slug },
      include: { grade: true, category: true },
    }),
    getSession(),
    getSettings(),
    prisma.grade.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!course || !course.isPublished) notFound();

  return (
    <PublicShell>
      <div className="container-site max-w-2xl py-8">
        <h1 className="section-title">احجز الكورس</h1>
        <div className="card mt-4 flex gap-4 p-4">
          <img src={course.image || "/covers/primary-4.svg"} alt="" className="h-20 w-28 rounded-2xl object-cover" />
          <div>
            <p className="font-black text-ink">{course.title}</p>
            <p className="text-sm text-navy/60">{course.grade?.name || course.category?.name}</p>
            <p className="mt-1 font-black text-teal">{formatPrice(course.price)}</p>
          </div>
        </div>
        <BookingWizard
          course={{
            id: course.id,
            slug: course.slug,
            title: course.title,
            price: course.price,
            gradeName: course.grade?.name || "",
          }}
          user={session}
          settings={settings}
          grades={grades.map((g) => g.name)}
        />
      </div>
    </PublicShell>
  );
}
