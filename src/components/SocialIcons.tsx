import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "./icons";
import { waLink } from "@/lib/utils";

export function SocialIcons({
  settings,
  className = "",
}: {
  settings: Record<string, string>;
  className?: string;
}) {
  const items = [
    settings.facebookUrl
      ? { href: settings.facebookUrl, label: "Facebook — Mr Ahmed Shaban", Icon: FacebookIcon }
      : null,
    {
      href: settings.instagramUrl || "https://www.instagram.com/shaban4english/",
      label: "Instagram — shaban4english",
      Icon: InstagramIcon,
    },
    settings.youtubeUrl
      ? { href: settings.youtubeUrl, label: "YouTube — Mr Ahmed Shaban", Icon: YoutubeIcon }
      : null,
    settings.tiktokUrl
      ? { href: settings.tiktokUrl, label: "TikTok — Mr Ahmed Shaban", Icon: TiktokIcon }
      : null,
    {
      href: waLink(settings.whatsapp || "01552647559"),
      label: "WhatsApp",
      Icon: WhatsappIcon,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    Icon: typeof FacebookIcon;
  }[];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          aria-label={item.label}
          className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-current hover:bg-gold hover:text-ink"
        >
          <item.Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
