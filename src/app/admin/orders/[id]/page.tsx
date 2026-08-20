import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderActions } from "@/components/admin/OrderActions";
import { formatPrice, orderStatusLabel } from "@/lib/utils";

export default async function OrderDetails({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { course: true, user: true },
  });
  if (!order) notFound();
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="card p-5">
        <h1 className="text-xl font-black">طلب الحجز</h1>
        <ul className="mt-4 space-y-2 text-sm font-bold text-navy/80">
          <li>الحالة: {orderStatusLabel(order.status)}</li>
          <li>الطالب: {order.fullName}</li>
          <li>الهاتف: {order.phone}</li>
          <li>البريد: {order.email || "—"}</li>
          <li>الصف: {order.gradeOrLevel || "—"}</li>
          <li>الكورس: {order.course.title}</li>
          <li>المبلغ: {formatPrice(order.amount)}</li>
          <li>صاحب التحويل: {order.transferName || "—"}</li>
          <li>هاتف التحويل: {order.transferPhone || "—"}</li>
          <li>مبلغ التحويل: {order.transferAmount ? formatPrice(order.transferAmount) : "—"}</li>
          <li>حساب مرتبط: {order.user?.name || "لا يوجد بعد"}</li>
        </ul>
        <OrderActions id={order.id} status={order.status} note={order.adminNote || ""} />
      </div>
      <div className="card p-5">
        <h2 className="font-black">إيصال الدفع</h2>
        {order.receiptPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/api/admin/receipts/${order.id}`} alt="إيصال" className="mt-3 max-h-[520px] w-full rounded-2xl object-contain bg-sand" />
        ) : (
          <p className="mt-3 text-navy/60">لا يوجد إيصال.</p>
        )}
      </div>
    </div>
  );
}
