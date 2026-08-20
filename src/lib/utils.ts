export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount: number) {
  return `${amount.toLocaleString("ar-EG")} جنيه`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/-+/g, "-");
}

export function youtubeId(url?: string | null) {
  if (!url) return null;
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/
  );
  return m?.[1] ?? null;
}

export function youtubeEmbed(url?: string | null) {
  const id = youtubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function waLink(phone: string, text?: string) {
  const digits = phone.replace(/[^\d]/g, "");
  const intl = digits.startsWith("0") ? `20${digits.slice(1)}` : digits;
  const base = `https://wa.me/${intl}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function orderStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "قيد المراجعة";
    case "PAYMENT_ACCEPTED":
      return "تم قبول الدفع";
    case "ACTIVATED":
      return "تم تفعيل الكورس";
    case "REJECTED":
      return "مرفوض";
    default:
      return status;
  }
}

export function parseJsonArray(value?: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

export function countLessons(course: {
  units: { lessons: unknown[] }[];
}) {
  return course.units.reduce((n, u) => n + u.lessons.length, 0);
}

export function countVideos(course: {
  units: { lessons: { videos: unknown[] }[] }[];
}) {
  return course.units.reduce(
    (n, u) => n + u.lessons.reduce((m, l) => m + l.videos.length, 0),
    0
  );
}

export function countFiles(course: {
  units: { lessons: { files: unknown[] }[] }[];
}) {
  return course.units.reduce(
    (n, u) => n + u.lessons.reduce((m, l) => m + l.files.length, 0),
    0
  );
}

export function countQuizzes(course: {
  units: { lessons: { quizzes: unknown[] }[] }[];
}) {
  return course.units.reduce(
    (n, u) => n + u.lessons.reduce((m, l) => m + l.quizzes.length, 0),
    0
  );
}
