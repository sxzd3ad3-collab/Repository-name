import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";

export default function NotFound() {
  return (
    <PublicShell>
      <div className="container-site py-20 text-center">
        <h1 className="section-title">الصفحة غير موجودة</h1>
        <Link href="/" className="btn-primary mt-6">
          العودة للرئيسية
        </Link>
      </div>
    </PublicShell>
  );
}
