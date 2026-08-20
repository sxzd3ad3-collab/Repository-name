import { prisma } from "./prisma";

export const DEFAULT_SETTINGS: Record<string, string> = {
  siteName: "مستر أحمد شعبان",
  siteNameEn: "Mr Ahmed Shaban",
  siteTagline:
    "منصة تعليمية متكاملة لتعلم اللغة الإنجليزية لجميع المراحل والمستويات، من تأسيس الأطفال والفونكس إلى المحادثة والجرامر وجميع مهارات اللغة الإنجليزية.",
  instapayName: "shaban4english1",
  instapayAddress: "https://ipn.eg/S/shaban4english1/instapay/9u7jAP",
  whatsapp: "01552647559",
  facebookUrl: "",
  instagramUrl: "https://www.instagram.com/shaban4english/",
  instagramHandle: "shaban4english",
  youtubeUrl: "",
  tiktokUrl: "",
  contactEmail: "",
  contactPhone: "01552647559",
  aboutName: "مستر أحمد شعبان",
  aboutBio:
    "معلم لغة إنجليزية متخصص في تبسيط المادة وتقديمها بطريقة عملية تناسب الأطفال والطلاب والكبار. أركز على الفهم، الممارسة، وبناء الثقة في استخدام اللغة.",
  aboutExperience:
    "خبرة في تدريس اللغة الإنجليزية لمراحل دراسية متعددة، مع برامج تأسيس، فونكس، جرامر، ومحادثة.",
  aboutMethod:
    "طريقة التدريس تعتمد على الشرح الواضح، التدريب المستمر، والأنشطة العملية حتى يستخدم الطالب اللغة وليس فقط يحفظها.",
  aboutVision:
    "أن يصبح تعلم الإنجليزية رحلة ممتعة وواضحة لكل طالب، وأن يخرج من الكورس وهو قادر على الفهم والتحدث بثقة.",
  aboutImage: "",
  logoUrl: "/logo.svg",
};

export async function getSettings() {
  const rows = await prisma.setting.findMany();
  const map = { ...DEFAULT_SETTINGS };
  for (const row of rows) map[row.key] = row.value;
  if (!map.instapayName) map.instapayName = DEFAULT_SETTINGS.instapayName;
  if (!map.instapayAddress) map.instapayAddress = DEFAULT_SETTINGS.instapayAddress;
  if (process.env.INSTAPAY_NAME) map.instapayName = process.env.INSTAPAY_NAME;
  if (process.env.INSTAPAY_ADDRESS) map.instapayAddress = process.env.INSTAPAY_ADDRESS;
  if (process.env.FACEBOOK_URL) map.facebookUrl = process.env.FACEBOOK_URL;
  if (process.env.YOUTUBE_URL) map.youtubeUrl = process.env.YOUTUBE_URL;
  if (process.env.TIKTOK_URL) map.tiktokUrl = process.env.TIKTOK_URL;
  return map;
}

export async function getSetting(key: string) {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? DEFAULT_SETTINGS[key] ?? "";
}

export async function setSettings(values: Record<string, string>) {
  await Promise.all(
    Object.entries(values).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
}
