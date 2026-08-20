import { prisma } from "@/lib/prisma";
import { GradesManager } from "@/components/admin/GradesManager";

export default async function GradesAdmin() {
  const [stages, categories] = await Promise.all([
    prisma.stage.findMany({ include: { grades: { orderBy: { sortOrder: "asc" } } }, orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  return (
    <div>
      <h1 className="section-title">المراحل والصفوف والتصنيفات</h1>
      <GradesManager stages={stages} categories={categories} />
    </div>
  );
}
