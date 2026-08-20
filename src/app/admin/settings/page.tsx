import { getSettings } from "@/lib/settings";
import { AdminPasswordForm, SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <h1 className="section-title">الإعدادات</h1>
      <p className="mt-2 text-navy/60">هذه الصفحة لك وحدك. منها تتحكم في الدفع والموقع وبياناتك.</p>
      <SettingsForm settings={settings} />
      <AdminPasswordForm />
    </div>
  );
}
