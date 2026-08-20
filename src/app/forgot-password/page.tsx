import { PublicShell } from "@/components/PublicShell";
import { ForgotForm } from "@/components/auth/ForgotForm";

export const metadata = { title: "استعادة كلمة المرور" };

export default function ForgotPage() {
  return (
    <PublicShell>
      <div className="container-site max-w-md py-10">
        <h1 className="section-title">استعادة كلمة المرور</h1>
        <p className="mt-2 text-sm leading-7 text-navy/70">
          أدخل رقم الهاتف أو البريد. سيتم إنشاء طلب إعادة تعيين، ويمكن للإدارة إرسال رابط التعيين أو تعيين كلمة مرور جديدة. يمكنك أيضًا التواصل عبر واتساب 01552647559.
        </p>
        <ForgotForm />
      </div>
    </PublicShell>
  );
}
