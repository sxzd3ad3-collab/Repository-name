import { PublicShell } from "@/components/PublicShell";
import { getSettings } from "@/lib/settings";

export const metadata = { title: "من نحن" };

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <PublicShell>
      <div className="container-site py-10">
        <h1 className="section-title">من نحن</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="card overflow-hidden">
            {s.aboutImage ? (
              <img src={s.aboutImage.startsWith("about/") ? `/api/public/image/${s.aboutImage}` : s.aboutImage} alt={s.aboutName} className="aspect-square w-full object-cover" />
            ) : (
              <div className="grid aspect-square place-items-center bg-navy text-white">
                <div className="text-center">
                  <p className="text-5xl font-black">AS</p>
                  <p className="mt-2 text-sm">{s.siteNameEn}</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-black text-ink">{s.aboutName || "مستر أحمد شعبان"}</h2>
            <p className="mt-4 leading-8 text-navy/75">{s.aboutBio}</p>
            <h3 className="mt-6 font-black">خبرتي</h3>
            <p className="mt-2 leading-8 text-navy/75">{s.aboutExperience}</p>
            <h3 className="mt-6 font-black">طريقة التدريس</h3>
            <p className="mt-2 leading-8 text-navy/75">{s.aboutMethod}</p>
            <h3 className="mt-6 font-black">رؤيتي التعليمية</h3>
            <p className="mt-2 leading-8 text-navy/75">{s.aboutVision}</p>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
