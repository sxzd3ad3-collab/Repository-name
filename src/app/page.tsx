import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { PublicShell } from "@/components/PublicShell";
import { CourseCard } from "@/components/CourseCard";
import { waLink } from "@/lib/utils";
import { JsonLd } from "@/components/JsonLd";

export default async function HomePage() {
  const [settings, courses, stages, faqs] = await Promise.all([
    getSettings(),
    prisma.course.findMany({
      where: { isPublished: true, isFeatured: true },
      include: {
        grade: true,
        category: true,
        units: { include: { lessons: true } },
      },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    prisma.stage.findMany({
      include: { grades: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const skills = [
    { href: "/conversation", title: "English Conversation", desc: "كورس المحادثة الإنجليزية." },
    { href: "/phonics", title: "BrightStart Phonics", desc: "كورس تأسيس الأطفال والفونكس." },
    { href: "/skills/grammar", title: "Grammar", desc: "كورس القواعد." },
    { href: "/skills/vocabulary", title: "Vocabulary", desc: "كورس الكلمات والمفردات." },
    { href: "/skills/pronunciation", title: "Pronunciation", desc: "كورس النطق." },
    { href: "/skills/listening", title: "Listening", desc: "كورس الاستماع." },
    { href: "/skills/speaking", title: "Speaking", desc: "كورس التحدث." },
    { href: "/skills/reading", title: "Reading", desc: "كورس القراءة." },
    { href: "/skills/writing", title: "Writing", desc: "كورس الكتابة." },
  ];

  return (
    <PublicShell>
      <JsonLd settings={settings} faqs={faqs} />
      <section className="relative overflow-hidden bg-gradient-to-bl from-navy via-teal to-ocean text-white">
        <div className="container-site grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-amber">
              {settings.siteNameEn}
            </p>
            <h1 className="text-3xl font-black leading-snug sm:text-4xl lg:text-5xl">
              منصة مستر أحمد شعبان لتعلم اللغة الإنجليزية
            </h1>
            <p className="mt-3 text-lg font-bold text-amber sm:text-xl">
              اتعلم الإنجليزي بسهولة مع مستر أحمد شعبان
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
              كورسات ودروس أونلاين لجميع المراحل والمستويات، بطريقة سهلة وعملية تناسب الأطفال والطلاب والكبار.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/courses" className="btn-gold">
                تصفح الكورسات
              </Link>
              <Link href="/register" className="btn bg-white text-navy hover:bg-sand">
                ابدأ التعلم الآن
              </Link>
            </div>
          </div>
          <div className="card p-5 text-ink">
            <p className="text-sm font-bold text-teal">رحلة التعلم</p>
            <ol className="mt-3 space-y-3 text-sm font-bold text-navy/80">
              {[
                "اختار المرحلة أو الكورس",
                "احجز وادفع عبر InstaPay",
                "ارفع إيصال التحويل",
                "بعد التفعيل ابدأ مشاهدة الدروس",
              ].map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-sand text-teal">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="container-site py-12">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="section-title">الكورسات المتاحة</h2>
            <p className="mt-1 text-navy/60">أسعار تبدأ من 400 جنيه مصري، وقابلة للتعديل حسب كل كورس.</p>
          </div>
          <Link href="/courses" className="hidden font-bold text-teal sm:inline">
            كل الكورسات
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-site">
          <h2 className="section-title">المراحل الدراسية</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {stages.map((stage) => (
              <div key={stage.id} className="card p-5">
                <h3 className="text-lg font-black text-ink">{stage.name}</h3>
                <div className="mt-3 flex flex-col gap-2">
                  {stage.grades.map((g) => (
                    <Link
                      key={g.id}
                      href={`/grades/${g.slug}`}
                      className="rounded-2xl bg-sand px-3 py-3 text-sm font-bold text-navy hover:bg-teal hover:text-white"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-12">
        <h2 className="section-title">طور مستواك في اللغة الإنجليزية</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((s) => (
            <Link key={s.href} href={s.href} className="card p-5 hover:border-teal/30">
              <h3 className="font-black text-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-navy/70">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-l from-amber/20 to-coral/10 py-12">
        <div className="container-site grid items-center gap-6 lg:grid-cols-2">
          <div>
            <p className="font-bold text-coral">للأطفال</p>
            <h2 className="section-title">BrightStart Phonics</h2>
            <p className="mt-3 leading-8 text-navy/70">
              تأسيس ممتع: Alphabet، Letter Sounds، Phonics، CVC Words، Short Vowels، Reading، Vocabulary، Writing، Worksheets، Quizzes.
            </p>
            <Link href="/phonics" className="btn-primary mt-5">
              ادخل قسم الأطفال
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm font-bold">
            {["Alphabet", "Letter Sounds", "CVC Words", "Quizzes"].map((t) => (
              <div key={t} className="rounded-3xl bg-white p-5 text-center shadow-soft">
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site py-12">
        <h2 className="section-title">الأسئلة الشائعة</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <details key={f.id} className="card p-4">
              <summary className="cursor-pointer list-none font-black text-ink">{f.question}</summary>
              <p className="mt-2 leading-7 text-navy/70">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-site pb-12">
        <div className="card flex flex-col items-start justify-between gap-4 bg-navy p-6 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-black">جاهز تبدأ؟</h2>
            <p className="mt-1 text-white/75">اختار الكورس أو اسأل مباشرة على واتساب.</p>
          </div>
          <a
            className="btn-gold"
            href={waLink(settings.whatsapp || "01552647559")}
            target="_blank"
            rel="noreferrer"
          >
            تواصل معنا عبر WhatsApp
          </a>
        </div>
      </section>
    </PublicShell>
  );
}
