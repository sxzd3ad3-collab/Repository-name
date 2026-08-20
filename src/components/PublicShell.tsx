import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { Footer } from "./Footer";
import { Header } from "./Header";

export async function PublicShell({ children }: { children: React.ReactNode }) {
  const [settings, session] = await Promise.all([getSettings(), getSession()]);
  return (
    <div className="min-h-screen">
      <Header settings={settings} user={session} />
      <main>{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
