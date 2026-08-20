import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export default async function AdminHome() {
  const session = await getSession();
  const settings = await getSettings();
  const [students, courses, pending, activated, recent] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.course.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "ACTIVATED" } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { course: true },
    }),
  ]);
  const instapayReady = Boolean(settings.instapayName || settings.instapayAddress);
  const cards = [
    { label: "الطلاب", value: students, href: "/admin/students" },
    { label: "الكورسات", value: courses, href: "/admin/courses" },
    { label: "طلبات جديدة", value: pending, href: "/admin/orders" },
    { label: "كورسات مفعّلة", value: activated, href: "/admin/orders" },
  ];
  return (
    <div>
      <div className="card bg-navy p-5 text-white">
        <p className="text-sm font-bold text-amber">أنت المتحكم الوحيد في المنصة</p>
        <h1 className="mt-1 text-2xl font-black">مرحبًا {session?.name || "مستر أحمد شعبان"}</h1>
        <p className="mt-2 text-sm leading-7 text-white/75">
          من هنا تدير الطلاب والكورسات وطلبات الدفع. لا أحد غيرك يدخل لوحة التحكم.
        </p>
      </div>

      {!instapayReady && (
        <Link href="/admin/settings" className="card mt-4 block border-amber bg-amber/15 p-4">
          <p className="font-black text-ink">مطلوب منك الآن</p>
          <p className="mt-1 text-sm text-navy/70">
            ادخل الإعدادات واكتب اسم حساب InstaPay ورقم/عنوان التحويل حتى يقدر الطالب يدفع.
          </p>
        </Link>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-5">
            <p className="text-sm text-navy/60">{c.label}</p>
            <p className="mt-1 text-3xl font-black text-teal">{c.value}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 text-xl font-black">تحكم سريع</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Link href="/admin/orders" className="card p-4 font-bold">مراجعة طلبات الحجز والإيصالات</Link>
        <Link href="/admin/courses" className="card p-4 font-bold">إضافة أو تعديل كورس وسعره</Link>
        <Link href="/admin/students" className="card p-4 font-bold">الطلاب وتفعيل كورس يدويًا</Link>
        <Link href="/admin/settings" className="card p-4 font-bold">InstaPay والتواصل وصفحة من نحن</Link>
      </div>

      <h2 className="mt-8 text-xl font-black">آخر الطلبات</h2>
      <div className="mt-3 space-y-2">
        {recent.map((o) => (
          <Link key={o.id} href={`/admin/orders/${o.id}`} className="card flex justify-between p-4">
            <span className="font-bold">{o.fullName}</span>
            <span className="text-sm text-navy/60">{o.course.title}</span>
          </Link>
        ))}
        {recent.length === 0 && <p className="card p-5 text-navy/60">لا توجد طلبات حتى الآن.</p>}
      </div>
    </div>
  );
}
