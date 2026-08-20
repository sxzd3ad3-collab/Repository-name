import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { orderStatusLabel } from "@/lib/utils";

export default async function OrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status;
  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    include: { course: true, user: true },
    orderBy: { createdAt: "desc" },
  });
  const tabs = [
    ["", "الكل"],
    ["PENDING", "قيد المراجعة"],
    ["PAYMENT_ACCEPTED", "مقبول الدفع"],
    ["ACTIVATED", "مفعّل"],
    ["REJECTED", "مرفوض"],
  ];
  return (
    <div>
      <h1 className="section-title">الطلبات</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map(([v, l]) => (
          <Link key={l} href={v ? `/admin/orders?status=${v}` : "/admin/orders"} className="chip">
            {l}
          </Link>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {orders.map((o) => (
          <Link key={o.id} href={`/admin/orders/${o.id}`} className="card flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black">{o.fullName}</p>
              <p className="text-sm text-navy/60">{o.course.title} · {o.phone}</p>
            </div>
            <div className="text-sm font-bold">
              <span className="chip">{orderStatusLabel(o.status)}</span>
              <span className="mr-2 text-navy/50">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</span>
            </div>
          </Link>
        ))}
        {orders.length === 0 && <p className="card p-6 text-navy/60">لا توجد طلبات.</p>}
      </div>
    </div>
  );
}
