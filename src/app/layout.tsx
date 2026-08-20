import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { SEO, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#143A56",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = SEO.title;
  const description = s.siteTagline || SEO.description;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s | ${SEO.shortTitle}`,
    },
    description,
    keywords: SEO.keywords,
    applicationName: SEO.shortTitle,
    authors: [{ name: "مستر أحمد شعبان" }],
    creator: "Mr Ahmed Shaban",
    publisher: "منصة مستر أحمد شعبان",
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: "website",
      locale: "ar_EG",
      url: SITE_URL,
      siteName: SEO.shortTitle,
      title,
      description,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: SEO.shortTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    category: "education",
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
