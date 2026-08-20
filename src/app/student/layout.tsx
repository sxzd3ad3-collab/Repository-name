import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/student");
  if (session.role === "ADMIN") {
    // admin can view student area too
  }
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-navy/5 bg-white">
        <div className="container-site flex h-16 items-center justify-between">
          <Link href="/student" className="font-black text-navy">
            لوحة الطالب
          </Link>
          <nav className="flex items-center gap-2 text-sm font-bold">
            <Link href="/student" className="rounded-xl px-3 py-2 hover:bg-sand">
              كورساتي
            </Link>
            <Link href="/student/orders" className="rounded-xl px-3 py-2 hover:bg-sand">
              طلباتي
            </Link>
            <Link href="/courses" className="rounded-xl px-3 py-2 hover:bg-sand">
              تصفح
            </Link>
            {session.role === "ADMIN" && (
              <Link href="/admin" className="rounded-xl px-3 py-2 text-teal">
                الإدارة
              </Link>
            )}
            <LogoutButton />
          </nav>
        </div>
      </header>
      <div className="container-site py-6">{children}</div>
    </div>
  );
}
