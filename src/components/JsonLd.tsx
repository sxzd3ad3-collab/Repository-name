import { SEO, SITE_URL } from "@/lib/seo";

export function JsonLd({
  settings,
  faqs,
}: {
  settings: Record<string, string>;
  faqs: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#org`,
        name: "منصة مستر أحمد شعبان",
        alternateName: ["مستر أحمد شعبان", "Mr Ahmed Shaban"],
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
        image: `${SITE_URL}/og.jpg`,
        description: SEO.description,
        telephone: settings.whatsapp || "01552647559",
        sameAs: [
          settings.instagramUrl,
          settings.facebookUrl,
          settings.youtubeUrl,
          settings.tiktokUrl,
        ].filter(Boolean),
        areaServed: "EG",
        inLanguage: "ar",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "منصة مستر أحمد شعبان",
        inLanguage: "ar",
        publisher: { "@id": `${SITE_URL}/#org` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/courses?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
