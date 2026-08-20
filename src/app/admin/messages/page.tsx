import { prisma } from "@/lib/prisma";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="section-title">رسائل التواصل</h1>
      <div className="mt-5 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="card p-4">
            <p className="font-black">{m.name} · {m.phone}</p>
            <p className="text-sm text-navy/50">{m.email || ""} · {new Date(m.createdAt).toLocaleString("ar-EG")}</p>
            <p className="mt-2 leading-7">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-navy/60">لا توجد رسائل.</p>}
      </div>
    </div>
  );
}
