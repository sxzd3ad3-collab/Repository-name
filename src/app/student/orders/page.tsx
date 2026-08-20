import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderStatusLabel } from "@/lib/utils";

export default async function StudentOrders() {
  const session = await getSession();
  if (!session) return null;
  const orders = await prisma.order.findMany({
    where: { OR: [{ userId: session.id }, { phone: session.phone }] },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <h1 className="section-title">طلباتي</h1>
      <div className="mt-5 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="card p-4">
            <p className="font-black">{o.course.title}</p>
            <p className="mt-1 text-sm font-bold text-teal">{orderStatusLabel(o.status)}</p>
            {o.status === "ACTIVATED" && (
              <Link href={`/student/courses/${o.course.slug}`} className="mt-2 inline-block font-bold text-navy">
                ابدأ التعلم
              </Link>
            )}
            {o.adminNote && <p className="mt-2 text-sm text-navy/60">{o.adminNote}</p>}
          </div>
        ))}
        {orders.length === 0 && <p className="text-navy/60">لا توجد طلبات.</p>}
      </div>
    </div>
  );
}
