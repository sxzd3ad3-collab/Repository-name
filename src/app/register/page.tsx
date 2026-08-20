import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/PublicShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "إنشاء حساب" };

export default async function RegisterPage() {
  const grades = await prisma.grade.findMany({
    include: { stage: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <PublicShell>
      <div className="container-site max-w-md py-10">
        <h1 className="section-title">إنشاء حساب طالب</h1>
        <RegisterForm
          grades={grades.map((g) => ({ id: g.id, name: `${g.stage.name} — ${g.name}` }))}
        />
        <p className="mt-4 text-center text-sm text-navy/70">
          لديك حساب؟{" "}
          <Link href="/login" className="font-bold text-teal">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </PublicShell>
  );
}
