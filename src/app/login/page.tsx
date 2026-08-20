import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "تسجيل الدخول" };

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <PublicShell>
      <div className="container-site max-w-md py-10">
        <h1 className="section-title">تسجيل الدخول</h1>
        <p className="mt-2 text-navy/60">ادخل برقم الهاتف أو البريد الإلكتروني.</p>
        <LoginForm next={searchParams.next} />
        <p className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="font-bold text-teal">
            نسيت كلمة المرور؟
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-navy/70">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-bold text-teal">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </PublicShell>
  );
}
