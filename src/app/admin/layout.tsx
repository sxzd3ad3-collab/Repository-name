import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "@/components/LogoutButton";

const links = [
  { href: "/admin", label: "الرئيسية" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/students", label: "الطلاب" },
  { href: "/admin/courses", label: "الكورسات" },
  { href: "/admin/grades", label: "المراحل والتصنيفات" },
  { href: "/admin/faqs", label: "الأسئلة الشائعة" },
  { href: "/admin/messages", label: "الرسائل" },
  { href: "/admin/settings", label: "الإعدادات" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");
  const pending = await prisma.order.count({ where: { status: "PENDING" } });

  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-30 border-b border-navy/5 bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="font-black">
            لوحة التحكم
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin/orders" className="rounded-full bg-gold px-3 py-1 font-black text-ink">
              طلب حجز جديد {pending > 0 ? `(${pending})` : ""}
            </Link>
            <Link href="/" className="rounded-xl bg-white/10 px-3 py-2">
              الموقع
            </Link>
            <LogoutButton />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="shrink-0 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold">
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
    </div>
  );
}
