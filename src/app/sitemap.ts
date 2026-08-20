import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, grades] = await Promise.all([
    prisma.course.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.grade.findMany({ select: { slug: true } }),
  ]);

  const staticPages = [
    "",
    "/courses",
    "/grades",
    "/conversation",
    "/phonics",
    "/skills",
    "/about",
    "/contact",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [
    ...staticPages,
    ...["a1", "a2", "b1", "b2", "c1", "c2"].map((level) => ({
      url: `${SITE_URL}/conversation/${level}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...grades.map((g) => ({
      url: `${SITE_URL}/grades/${g.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...courses.map((c) => ({
      url: `${SITE_URL}/courses/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
