import { PublicShell } from "@/components/PublicShell";
import { getSettings } from "@/lib/settings";
import { ContactForm } from "@/components/ContactForm";
import { waLink } from "@/lib/utils";
import { SocialIcons } from "@/components/SocialIcons";

export const metadata = { title: "تواصل معنا" };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <PublicShell>
      <div className="container-site py-10">
        <h1 className="section-title">تواصل معنا</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <p className="font-bold text-navy/70">واتساب: {s.whatsapp || "01552647559"}</p>
            {s.contactEmail && <p className="mt-2 font-bold text-navy/70">البريد: {s.contactEmail}</p>}
            <p className="mt-2 font-bold text-navy/70">Instagram: shaban4english</p>
            <a
              href={waLink(s.whatsapp || "01552647559", "السلام عليكم مستر أحمد")}
              className="btn-gold mt-5"
              target="_blank"
              rel="noreferrer"
            >
              تواصل معنا عبر WhatsApp
            </a>
            <div className="mt-6 text-navy">
              <SocialIcons settings={s} className="!text-navy" />
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </PublicShell>
  );
}
