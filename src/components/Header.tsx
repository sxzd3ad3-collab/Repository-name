"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/courses", label: "الكورسات" },
  { href: "/grades", label: "المراحل الدراسية" },
  { href: "/conversation", label: "المحادثة" },
  { href: "/phonics", label: "BrightStart Phonics" },
  { href: "/skills/grammar", label: "Grammar" },
  { href: "/skills", label: "جميع المهارات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Header({
  settings,
  user,
}: {
  settings: Record<string, string>;
  user: { name: string; role: string } | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const logo = settings.logoUrl || "/logo.svg";

  return (
    <header className="sticky top-0 z-40 border-b border-navy/5 bg-cream/90 backdrop-blur">
      <div className="container-site flex h-16 items-center justify-between gap-3 sm:h-[72px]">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <img src={logo} alt="" className="h-10 w-10 rounded-xl object-cover" />
          <span className="truncate">
            <span className="block text-sm font-black text-ink sm:text-base">
              {settings.siteName}
            </span>
            <span className="hidden text-[11px] font-bold text-teal sm:block">
              {settings.siteNameEn}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.slice(0, 6).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-xl px-2.5 py-2 text-[13px] font-bold ${
                pathname === l.href ? "bg-white text-teal" : "text-navy/80 hover:bg-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href={user.role === "ADMIN" ? "/admin" : "/student"}
              className="hidden rounded-2xl bg-navy px-3 py-2 text-sm font-bold text-white sm:inline-flex"
            >
              {user.role === "ADMIN" ? "لوحة التحكم" : "حسابي"}
            </Link>
          ) : (
            <Link href="/login" className="hidden text-sm font-bold text-navy sm:inline">
              تسجيل الدخول
            </Link>
          )}
          <Link href="/courses" className="btn-primary !px-3 !py-2 text-sm">
            ابدأ التعلم الآن
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-4 bg-ink" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-navy/5 bg-cream px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-3 text-base font-bold text-navy hover:bg-white"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={user ? (user.role === "ADMIN" ? "/admin" : "/student") : "/login"}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-3 py-3 text-base font-bold text-teal"
            >
              {user ? (user.role === "ADMIN" ? "لوحة التحكم" : "حسابي") : "تسجيل الدخول"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
