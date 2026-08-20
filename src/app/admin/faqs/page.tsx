import { prisma } from "@/lib/prisma";
import { FaqManager } from "@/components/admin/FaqManager";

export default async function FaqsPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="section-title">الأسئلة الشائعة</h1>
      <FaqManager faqs={faqs} />
    </div>
  );
}
