import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { DeckForm } from "@/components/deck-form";
import { DeckCard } from "@/components/deck-card";

export default async function DecksPage() {
  const user = await requireUser();
  const decks = await db.deck.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { words: true } } }
  });
  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-7"><p className="text-sm font-bold text-brand">THƯ VIỆN CỦA BẠN</p><h1 className="mt-2 text-3xl font-extrabold">Bộ từ vựng</h1><p className="mt-2 text-slate-500">Tổ chức từ mới theo mục tiêu học tập.</p></header>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          {decks.length ? <div className="grid gap-4 sm:grid-cols-2">{decks.map((deck) => <DeckCard key={deck.id} deck={deck} />)}</div> : <div className="card p-8 text-center text-slate-500">Chưa có bộ từ. Tạo bộ đầu tiên để bắt đầu nhé.</div>}
        </section>
        <aside><h2 className="mb-3 text-lg font-extrabold">Tạo bộ mới</h2><DeckForm /></aside>
      </div>
    </div>
  );
}
