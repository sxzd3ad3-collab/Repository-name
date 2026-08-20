import Link from "next/link";
import { SocialIcons } from "./SocialIcons";
import { waLink } from "@/lib/utils";

export function Footer({ settings }: { settings: Record<string, string> }) {
  return (
    <footer className="mt-16 bg-ink text-sand">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <img src={settings.logoUrl || "/logo.svg"} alt="" className="h-12 w-12 rounded-2xl" />
            <div>
              <p className="text-lg font-black text-white">{settings.siteName}</p>
              <p className="text-sm text-amber">{settings.siteNameEn}</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-sand/80">
            منصة تعليمية لتعلم اللغة الإنجليزية لجميع المراحل والمستويات.
          </p>
          <a
            href={waLink(settings.whatsapp || "01552647559", "السلام عليكم، أريد الاستفسار عن الكورسات")}
            className="btn-gold mt-5"
            target="_blank"
            rel="noreferrer"
          >
            تواصل معنا عبر WhatsApp
          </a>
        </div>
        <div>
          <p className="mb-3 font-black text-white">روابط سريعة</p>
          <div className="flex flex-col gap-2 text-sm font-bold text-sand/80">
            <Link href="/">الرئيسية</Link>
            <Link href="/courses">الكورسات</Link>
            <Link href="/grades">المراحل الدراسية</Link>
            <Link href="/conversation">المحادثة</Link>
            <Link href="/phonics">BrightStart Phonics</Link>
            <Link href="/contact">تواصل معنا</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 font-black text-white">تابعنا</p>
          <p className="mb-3 text-sm text-sand/70">Instagram: shaban4english</p>
          <SocialIcons settings={settings} />
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-sand/60">
        © 2026 Mr Ahmed Shaban. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
