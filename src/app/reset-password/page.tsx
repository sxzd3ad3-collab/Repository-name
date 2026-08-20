import { PublicShell } from "@/components/PublicShell";
import { ResetForm } from "@/components/auth/ResetForm";

export default function ResetPage({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <PublicShell>
      <div className="container-site max-w-md py-10">
        <h1 className="section-title">تعيين كلمة مرور جديدة</h1>
        <ResetForm token={searchParams.token || ""} />
      </div>
    </PublicShell>
  );
}
